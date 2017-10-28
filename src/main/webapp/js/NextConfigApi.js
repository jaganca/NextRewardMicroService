(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

/**
 * Expose `Emitter`.
 */

if (typeof module !== 'undefined') {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }
  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};

},{}],2:[function(require,module,exports){
/**
 * Root reference for iframes.
 */

var root;
if (typeof window !== 'undefined') { // Browser window
  root = window;
} else if (typeof self !== 'undefined') { // Web Worker
  root = self;
} else { // Other environments
  console.warn("Using browser-only version of superagent in non-browser environment");
  root = this;
}

var Emitter = require('emitter');
var requestBase = require('./request-base');
var isObject = require('./is-object');

/**
 * Noop.
 */

function noop(){};

/**
 * Expose `request`.
 */

var request = module.exports = require('./request').bind(null, Request);

/**
 * Determine XHR.
 */

request.getXHR = function () {
  if (root.XMLHttpRequest
      && (!root.location || 'file:' != root.location.protocol
          || !root.ActiveXObject)) {
    return new XMLHttpRequest;
  } else {
    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
  }
  throw Error("Browser-only verison of superagent could not find XHR");
};

/**
 * Removes leading and trailing whitespace, added to support IE.
 *
 * @param {String} s
 * @return {String}
 * @api private
 */

var trim = ''.trim
  ? function(s) { return s.trim(); }
  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

/**
 * Serialize the given `obj`.
 *
 * @param {Object} obj
 * @return {String}
 * @api private
 */

function serialize(obj) {
  if (!isObject(obj)) return obj;
  var pairs = [];
  for (var key in obj) {
    pushEncodedKeyValuePair(pairs, key, obj[key]);
  }
  return pairs.join('&');
}

/**
 * Helps 'serialize' with serializing arrays.
 * Mutates the pairs array.
 *
 * @param {Array} pairs
 * @param {String} key
 * @param {Mixed} val
 */

function pushEncodedKeyValuePair(pairs, key, val) {
  if (val != null) {
    if (Array.isArray(val)) {
      val.forEach(function(v) {
        pushEncodedKeyValuePair(pairs, key, v);
      });
    } else if (isObject(val)) {
      for(var subkey in val) {
        pushEncodedKeyValuePair(pairs, key + '[' + subkey + ']', val[subkey]);
      }
    } else {
      pairs.push(encodeURIComponent(key)
        + '=' + encodeURIComponent(val));
    }
  } else if (val === null) {
    pairs.push(encodeURIComponent(key));
  }
}

/**
 * Expose serialization method.
 */

 request.serializeObject = serialize;

 /**
  * Parse the given x-www-form-urlencoded `str`.
  *
  * @param {String} str
  * @return {Object}
  * @api private
  */

function parseString(str) {
  var obj = {};
  var pairs = str.split('&');
  var pair;
  var pos;

  for (var i = 0, len = pairs.length; i < len; ++i) {
    pair = pairs[i];
    pos = pair.indexOf('=');
    if (pos == -1) {
      obj[decodeURIComponent(pair)] = '';
    } else {
      obj[decodeURIComponent(pair.slice(0, pos))] =
        decodeURIComponent(pair.slice(pos + 1));
    }
  }

  return obj;
}

/**
 * Expose parser.
 */

request.parseString = parseString;

/**
 * Default MIME type map.
 *
 *     superagent.types.xml = 'application/xml';
 *
 */

request.types = {
  html: 'text/html',
  json: 'application/json',
  xml: 'application/xml',
  urlencoded: 'application/x-www-form-urlencoded',
  'form': 'application/x-www-form-urlencoded',
  'form-data': 'application/x-www-form-urlencoded'
};

/**
 * Default serialization map.
 *
 *     superagent.serialize['application/xml'] = function(obj){
 *       return 'generated xml here';
 *     };
 *
 */

 request.serialize = {
   'application/x-www-form-urlencoded': serialize,
   'application/json': JSON.stringify
 };

 /**
  * Default parsers.
  *
  *     superagent.parse['application/xml'] = function(str){
  *       return { object parsed from str };
  *     };
  *
  */

request.parse = {
  'application/x-www-form-urlencoded': parseString,
  'application/json': JSON.parse
};

/**
 * Parse the given header `str` into
 * an object containing the mapped fields.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function parseHeader(str) {
  var lines = str.split(/\r?\n/);
  var fields = {};
  var index;
  var line;
  var field;
  var val;

  lines.pop(); // trailing CRLF

  for (var i = 0, len = lines.length; i < len; ++i) {
    line = lines[i];
    index = line.indexOf(':');
    field = line.slice(0, index).toLowerCase();
    val = trim(line.slice(index + 1));
    fields[field] = val;
  }

  return fields;
}

/**
 * Check if `mime` is json or has +json structured syntax suffix.
 *
 * @param {String} mime
 * @return {Boolean}
 * @api private
 */

function isJSON(mime) {
  return /[\/+]json\b/.test(mime);
}

/**
 * Return the mime type for the given `str`.
 *
 * @param {String} str
 * @return {String}
 * @api private
 */

function type(str){
  return str.split(/ *; */).shift();
};

/**
 * Return header field parameters.
 *
 * @param {String} str
 * @return {Object}
 * @api private
 */

function params(str){
  return str.split(/ *; */).reduce(function(obj, str){
    var parts = str.split(/ *= */),
        key = parts.shift(),
        val = parts.shift();

    if (key && val) obj[key] = val;
    return obj;
  }, {});
};

/**
 * Initialize a new `Response` with the given `xhr`.
 *
 *  - set flags (.ok, .error, etc)
 *  - parse header
 *
 * Examples:
 *
 *  Aliasing `superagent` as `request` is nice:
 *
 *      request = superagent;
 *
 *  We can use the promise-like API, or pass callbacks:
 *
 *      request.get('/').end(function(res){});
 *      request.get('/', function(res){});
 *
 *  Sending data can be chained:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' })
 *        .end(function(res){});
 *
 *  Or passed to `.send()`:
 *
 *      request
 *        .post('/user')
 *        .send({ name: 'tj' }, function(res){});
 *
 *  Or passed to `.post()`:
 *
 *      request
 *        .post('/user', { name: 'tj' })
 *        .end(function(res){});
 *
 * Or further reduced to a single call for simple cases:
 *
 *      request
 *        .post('/user', { name: 'tj' }, function(res){});
 *
 * @param {XMLHTTPRequest} xhr
 * @param {Object} options
 * @api private
 */

function Response(req, options) {
  options = options || {};
  this.req = req;
  this.xhr = this.req.xhr;
  // responseText is accessible only if responseType is '' or 'text' and on older browsers
  this.text = ((this.req.method !='HEAD' && (this.xhr.responseType === '' || this.xhr.responseType === 'text')) || typeof this.xhr.responseType === 'undefined')
     ? this.xhr.responseText
     : null;
  this.statusText = this.req.xhr.statusText;
  this._setStatusProperties(this.xhr.status);
  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
  // getResponseHeader still works. so we get content-type even if getting
  // other headers fails.
  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
  this._setHeaderProperties(this.header);
  this.body = this.req.method != 'HEAD'
    ? this._parseBody(this.text ? this.text : this.xhr.response)
    : null;
}

/**
 * Get case-insensitive `field` value.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

Response.prototype.get = function(field){
  return this.header[field.toLowerCase()];
};

/**
 * Set header related properties:
 *
 *   - `.type` the content type without params
 *
 * A response of "Content-Type: text/plain; charset=utf-8"
 * will provide you with a `.type` of "text/plain".
 *
 * @param {Object} header
 * @api private
 */

Response.prototype._setHeaderProperties = function(header){
  // content-type
  var ct = this.header['content-type'] || '';
  this.type = type(ct);

  // params
  var obj = params(ct);
  for (var key in obj) this[key] = obj[key];
};

/**
 * Parse the given body `str`.
 *
 * Used for auto-parsing of bodies. Parsers
 * are defined on the `superagent.parse` object.
 *
 * @param {String} str
 * @return {Mixed}
 * @api private
 */

Response.prototype._parseBody = function(str){
  var parse = request.parse[this.type];
  if (!parse && isJSON(this.type)) {
    parse = request.parse['application/json'];
  }
  return parse && str && (str.length || str instanceof Object)
    ? parse(str)
    : null;
};

/**
 * Set flags such as `.ok` based on `status`.
 *
 * For example a 2xx response will give you a `.ok` of __true__
 * whereas 5xx will be __false__ and `.error` will be __true__. The
 * `.clientError` and `.serverError` are also available to be more
 * specific, and `.statusType` is the class of error ranging from 1..5
 * sometimes useful for mapping respond colors etc.
 *
 * "sugar" properties are also defined for common cases. Currently providing:
 *
 *   - .noContent
 *   - .badRequest
 *   - .unauthorized
 *   - .notAcceptable
 *   - .notFound
 *
 * @param {Number} status
 * @api private
 */

Response.prototype._setStatusProperties = function(status){
  // handle IE9 bug: http://stackoverflow.com/questions/10046972/msie-returns-status-code-of-1223-for-ajax-request
  if (status === 1223) {
    status = 204;
  }

  var type = status / 100 | 0;

  // status / class
  this.status = this.statusCode = status;
  this.statusType = type;

  // basics
  this.info = 1 == type;
  this.ok = 2 == type;
  this.clientError = 4 == type;
  this.serverError = 5 == type;
  this.error = (4 == type || 5 == type)
    ? this.toError()
    : false;

  // sugar
  this.accepted = 202 == status;
  this.noContent = 204 == status;
  this.badRequest = 400 == status;
  this.unauthorized = 401 == status;
  this.notAcceptable = 406 == status;
  this.notFound = 404 == status;
  this.forbidden = 403 == status;
};

/**
 * Return an `Error` representative of this response.
 *
 * @return {Error}
 * @api public
 */

Response.prototype.toError = function(){
  var req = this.req;
  var method = req.method;
  var url = req.url;

  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
  var err = new Error(msg);
  err.status = this.status;
  err.method = method;
  err.url = url;

  return err;
};

/**
 * Expose `Response`.
 */

request.Response = Response;

/**
 * Initialize a new `Request` with the given `method` and `url`.
 *
 * @param {String} method
 * @param {String} url
 * @api public
 */

function Request(method, url) {
  var self = this;
  this._query = this._query || [];
  this.method = method;
  this.url = url;
  this.header = {}; // preserves header name case
  this._header = {}; // coerces header names to lowercase
  this.on('end', function(){
    var err = null;
    var res = null;

    try {
      res = new Response(self);
    } catch(e) {
      err = new Error('Parser is unable to parse the response');
      err.parse = true;
      err.original = e;
      // issue #675: return the raw response if the response parsing fails
      err.rawResponse = self.xhr && self.xhr.responseText ? self.xhr.responseText : null;
      // issue #876: return the http status code if the response parsing fails
      err.statusCode = self.xhr && self.xhr.status ? self.xhr.status : null;
      return self.callback(err);
    }

    self.emit('response', res);

    var new_err;
    try {
      if (res.status < 200 || res.status >= 300) {
        new_err = new Error(res.statusText || 'Unsuccessful HTTP response');
        new_err.original = err;
        new_err.response = res;
        new_err.status = res.status;
      }
    } catch(e) {
      new_err = e; // #985 touching res may cause INVALID_STATE_ERR on old Android
    }

    // #1000 don't catch errors from the callback to avoid double calling it
    if (new_err) {
      self.callback(new_err, res);
    } else {
      self.callback(null, res);
    }
  });
}

/**
 * Mixin `Emitter` and `requestBase`.
 */

Emitter(Request.prototype);
for (var key in requestBase) {
  Request.prototype[key] = requestBase[key];
}

/**
 * Set Content-Type to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.xml = 'application/xml';
 *
 *      request.post('/')
 *        .type('xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 *      request.post('/')
 *        .type('application/xml')
 *        .send(xmlstring)
 *        .end(callback);
 *
 * @param {String} type
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.type = function(type){
  this.set('Content-Type', request.types[type] || type);
  return this;
};

/**
 * Set responseType to `val`. Presently valid responseTypes are 'blob' and
 * 'arraybuffer'.
 *
 * Examples:
 *
 *      req.get('/')
 *        .responseType('blob')
 *        .end(callback);
 *
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.responseType = function(val){
  this._responseType = val;
  return this;
};

/**
 * Set Accept to `type`, mapping values from `request.types`.
 *
 * Examples:
 *
 *      superagent.types.json = 'application/json';
 *
 *      request.get('/agent')
 *        .accept('json')
 *        .end(callback);
 *
 *      request.get('/agent')
 *        .accept('application/json')
 *        .end(callback);
 *
 * @param {String} accept
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.accept = function(type){
  this.set('Accept', request.types[type] || type);
  return this;
};

/**
 * Set Authorization field value with `user` and `pass`.
 *
 * @param {String} user
 * @param {String} pass
 * @param {Object} options with 'type' property 'auto' or 'basic' (default 'basic')
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.auth = function(user, pass, options){
  if (!options) {
    options = {
      type: 'basic'
    }
  }

  switch (options.type) {
    case 'basic':
      var str = btoa(user + ':' + pass);
      this.set('Authorization', 'Basic ' + str);
    break;

    case 'auto':
      this.username = user;
      this.password = pass;
    break;
  }
  return this;
};

/**
* Add query-string `val`.
*
* Examples:
*
*   request.get('/shoes')
*     .query('size=10')
*     .query({ color: 'blue' })
*
* @param {Object|String} val
* @return {Request} for chaining
* @api public
*/

Request.prototype.query = function(val){
  if ('string' != typeof val) val = serialize(val);
  if (val) this._query.push(val);
  return this;
};

/**
 * Queue the given `file` as an attachment to the specified `field`,
 * with optional `filename`.
 *
 * ``` js
 * request.post('/upload')
 *   .attach('content', new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
 *   .end(callback);
 * ```
 *
 * @param {String} field
 * @param {Blob|File} file
 * @param {String} filename
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.attach = function(field, file, filename){
  this._getFormData().append(field, file, filename || file.name);
  return this;
};

Request.prototype._getFormData = function(){
  if (!this._formData) {
    this._formData = new root.FormData();
  }
  return this._formData;
};

/**
 * Invoke the callback with `err` and `res`
 * and handle arity check.
 *
 * @param {Error} err
 * @param {Response} res
 * @api private
 */

Request.prototype.callback = function(err, res){
  var fn = this._callback;
  this.clearTimeout();
  fn(err, res);
};

/**
 * Invoke callback with x-domain error.
 *
 * @api private
 */

Request.prototype.crossDomainError = function(){
  var err = new Error('Request has been terminated\nPossible causes: the network is offline, Origin is not allowed by Access-Control-Allow-Origin, the page is being unloaded, etc.');
  err.crossDomain = true;

  err.status = this.status;
  err.method = this.method;
  err.url = this.url;

  this.callback(err);
};

/**
 * Invoke callback with timeout error.
 *
 * @api private
 */

Request.prototype._timeoutError = function(){
  var timeout = this._timeout;
  var err = new Error('timeout of ' + timeout + 'ms exceeded');
  err.timeout = timeout;
  this.callback(err);
};

/**
 * Compose querystring to append to req.url
 *
 * @api private
 */

Request.prototype._appendQueryString = function(){
  var query = this._query.join('&');
  if (query) {
    this.url += ~this.url.indexOf('?')
      ? '&' + query
      : '?' + query;
  }
};

/**
 * Initiate request, invoking callback `fn(res)`
 * with an instanceof `Response`.
 *
 * @param {Function} fn
 * @return {Request} for chaining
 * @api public
 */

Request.prototype.end = function(fn){
  var self = this;
  var xhr = this.xhr = request.getXHR();
  var timeout = this._timeout;
  var data = this._formData || this._data;

  // store callback
  this._callback = fn || noop;

  // state change
  xhr.onreadystatechange = function(){
    if (4 != xhr.readyState) return;

    // In IE9, reads to any property (e.g. status) off of an aborted XHR will
    // result in the error "Could not complete the operation due to error c00c023f"
    var status;
    try { status = xhr.status } catch(e) { status = 0; }

    if (0 == status) {
      if (self.timedout) return self._timeoutError();
      if (self._aborted) return;
      return self.crossDomainError();
    }
    self.emit('end');
  };

  // progress
  var handleProgress = function(direction, e) {
    if (e.total > 0) {
      e.percent = e.loaded / e.total * 100;
    }
    e.direction = direction;
    self.emit('progress', e);
  }
  if (this.hasListeners('progress')) {
    try {
      xhr.onprogress = handleProgress.bind(null, 'download');
      if (xhr.upload) {
        xhr.upload.onprogress = handleProgress.bind(null, 'upload');
      }
    } catch(e) {
      // Accessing xhr.upload fails in IE from a web worker, so just pretend it doesn't exist.
      // Reported here:
      // https://connect.microsoft.com/IE/feedback/details/837245/xmlhttprequest-upload-throws-invalid-argument-when-used-from-web-worker-context
    }
  }

  // timeout
  if (timeout && !this._timer) {
    this._timer = setTimeout(function(){
      self.timedout = true;
      self.abort();
    }, timeout);
  }

  // querystring
  this._appendQueryString();

  // initiate request
  if (this.username && this.password) {
    xhr.open(this.method, this.url, true, this.username, this.password);
  } else {
    xhr.open(this.method, this.url, true);
  }

  // CORS
  if (this._withCredentials) xhr.withCredentials = true;

  // body
  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !this._isHost(data)) {
    // serialize stuff
    var contentType = this._header['content-type'];
    var serialize = this._serializer || request.serialize[contentType ? contentType.split(';')[0] : ''];
    if (!serialize && isJSON(contentType)) serialize = request.serialize['application/json'];
    if (serialize) data = serialize(data);
  }

  // set header fields
  for (var field in this.header) {
    if (null == this.header[field]) continue;
    xhr.setRequestHeader(field, this.header[field]);
  }

  if (this._responseType) {
    xhr.responseType = this._responseType;
  }

  // send stuff
  this.emit('request', this);

  // IE11 xhr.send(undefined) sends 'undefined' string as POST payload (instead of nothing)
  // We need null here if data is undefined
  xhr.send(typeof data !== 'undefined' ? data : null);
  return this;
};


/**
 * Expose `Request`.
 */

request.Request = Request;

/**
 * GET `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.get = function(url, data, fn){
  var req = request('GET', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.query(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * HEAD `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.head = function(url, data, fn){
  var req = request('HEAD', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * OPTIONS query to `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.options = function(url, data, fn){
  var req = request('OPTIONS', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * DELETE `url` with optional callback `fn(res)`.
 *
 * @param {String} url
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

function del(url, fn){
  var req = request('DELETE', url);
  if (fn) req.end(fn);
  return req;
};

request['del'] = del;
request['delete'] = del;

/**
 * PATCH `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.patch = function(url, data, fn){
  var req = request('PATCH', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * POST `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed} [data]
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.post = function(url, data, fn){
  var req = request('POST', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

/**
 * PUT `url` with optional `data` and callback `fn(res)`.
 *
 * @param {String} url
 * @param {Mixed|Function} [data] or fn
 * @param {Function} [fn]
 * @return {Request}
 * @api public
 */

request.put = function(url, data, fn){
  var req = request('PUT', url);
  if ('function' == typeof data) fn = data, data = null;
  if (data) req.send(data);
  if (fn) req.end(fn);
  return req;
};

},{"./is-object":3,"./request":5,"./request-base":4,"emitter":1}],3:[function(require,module,exports){
/**
 * Check if `obj` is an object.
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

function isObject(obj) {
  return null !== obj && 'object' === typeof obj;
}

module.exports = isObject;

},{}],4:[function(require,module,exports){
/**
 * Module of mixed-in functions shared between node and client code
 */
var isObject = require('./is-object');

/**
 * Clear previous timeout.
 *
 * @return {Request} for chaining
 * @api public
 */

exports.clearTimeout = function _clearTimeout(){
  this._timeout = 0;
  clearTimeout(this._timer);
  return this;
};

/**
 * Override default response body parser
 *
 * This function will be called to convert incoming data into request.body
 *
 * @param {Function}
 * @api public
 */

exports.parse = function parse(fn){
  this._parser = fn;
  return this;
};

/**
 * Override default request body serializer
 *
 * This function will be called to convert data set via .send or .attach into payload to send
 *
 * @param {Function}
 * @api public
 */

exports.serialize = function serialize(fn){
  this._serializer = fn;
  return this;
};

/**
 * Set timeout to `ms`.
 *
 * @param {Number} ms
 * @return {Request} for chaining
 * @api public
 */

exports.timeout = function timeout(ms){
  this._timeout = ms;
  return this;
};

/**
 * Promise support
 *
 * @param {Function} resolve
 * @param {Function} reject
 * @return {Request}
 */

exports.then = function then(resolve, reject) {
  if (!this._fullfilledPromise) {
    var self = this;
    this._fullfilledPromise = new Promise(function(innerResolve, innerReject){
      self.end(function(err, res){
        if (err) innerReject(err); else innerResolve(res);
      });
    });
  }
  return this._fullfilledPromise.then(resolve, reject);
}

exports.catch = function(cb) {
  return this.then(undefined, cb);
};

/**
 * Allow for extension
 */

exports.use = function use(fn) {
  fn(this);
  return this;
}


/**
 * Get request header `field`.
 * Case-insensitive.
 *
 * @param {String} field
 * @return {String}
 * @api public
 */

exports.get = function(field){
  return this._header[field.toLowerCase()];
};

/**
 * Get case-insensitive header `field` value.
 * This is a deprecated internal API. Use `.get(field)` instead.
 *
 * (getHeader is no longer used internally by the superagent code base)
 *
 * @param {String} field
 * @return {String}
 * @api private
 * @deprecated
 */

exports.getHeader = exports.get;

/**
 * Set header `field` to `val`, or multiple fields with one object.
 * Case-insensitive.
 *
 * Examples:
 *
 *      req.get('/')
 *        .set('Accept', 'application/json')
 *        .set('X-API-Key', 'foobar')
 *        .end(callback);
 *
 *      req.get('/')
 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
 *        .end(callback);
 *
 * @param {String|Object} field
 * @param {String} val
 * @return {Request} for chaining
 * @api public
 */

exports.set = function(field, val){
  if (isObject(field)) {
    for (var key in field) {
      this.set(key, field[key]);
    }
    return this;
  }
  this._header[field.toLowerCase()] = val;
  this.header[field] = val;
  return this;
};

/**
 * Remove header `field`.
 * Case-insensitive.
 *
 * Example:
 *
 *      req.get('/')
 *        .unset('User-Agent')
 *        .end(callback);
 *
 * @param {String} field
 */
exports.unset = function(field){
  delete this._header[field.toLowerCase()];
  delete this.header[field];
  return this;
};

/**
 * Write the field `name` and `val`, or multiple fields with one object
 * for "multipart/form-data" request bodies.
 *
 * ``` js
 * request.post('/upload')
 *   .field('foo', 'bar')
 *   .end(callback);
 *
 * request.post('/upload')
 *   .field({ foo: 'bar', baz: 'qux' })
 *   .end(callback);
 * ```
 *
 * @param {String|Object} name
 * @param {String|Blob|File|Buffer|fs.ReadStream} val
 * @return {Request} for chaining
 * @api public
 */
exports.field = function(name, val) {

  // name should be either a string or an object.
  if (null === name ||  undefined === name) {
    throw new Error('.field(name, val) name can not be empty');
  }

  if (isObject(name)) {
    for (var key in name) {
      this.field(key, name[key]);
    }
    return this;
  }

  // val should be defined now
  if (null === val || undefined === val) {
    throw new Error('.field(name, val) val can not be empty');
  }
  this._getFormData().append(name, val);
  return this;
};

/**
 * Abort the request, and clear potential timeout.
 *
 * @return {Request}
 * @api public
 */
exports.abort = function(){
  if (this._aborted) {
    return this;
  }
  this._aborted = true;
  this.xhr && this.xhr.abort(); // browser
  this.req && this.req.abort(); // node
  this.clearTimeout();
  this.emit('abort');
  return this;
};

/**
 * Enable transmission of cookies with x-domain requests.
 *
 * Note that for this to work the origin must not be
 * using "Access-Control-Allow-Origin" with a wildcard,
 * and also must set "Access-Control-Allow-Credentials"
 * to "true".
 *
 * @api public
 */

exports.withCredentials = function(){
  // This is browser-only functionality. Node side is no-op.
  this._withCredentials = true;
  return this;
};

/**
 * Set the max redirects to `n`. Does noting in browser XHR implementation.
 *
 * @param {Number} n
 * @return {Request} for chaining
 * @api public
 */

exports.redirects = function(n){
  this._maxRedirects = n;
  return this;
};

/**
 * Convert to a plain javascript object (not JSON string) of scalar properties.
 * Note as this method is designed to return a useful non-this value,
 * it cannot be chained.
 *
 * @return {Object} describing method, url, and data of this request
 * @api public
 */

exports.toJSON = function(){
  return {
    method: this.method,
    url: this.url,
    data: this._data,
    headers: this._header
  };
};

/**
 * Check if `obj` is a host object,
 * we don't want to serialize these :)
 *
 * TODO: future proof, move to compoent land
 *
 * @param {Object} obj
 * @return {Boolean}
 * @api private
 */

exports._isHost = function _isHost(obj) {
  var str = {}.toString.call(obj);

  switch (str) {
    case '[object File]':
    case '[object Blob]':
    case '[object FormData]':
      return true;
    default:
      return false;
  }
}

/**
 * Send `data` as the request body, defaulting the `.type()` to "json" when
 * an object is given.
 *
 * Examples:
 *
 *       // manual json
 *       request.post('/user')
 *         .type('json')
 *         .send('{"name":"tj"}')
 *         .end(callback)
 *
 *       // auto json
 *       request.post('/user')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // manual x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send('name=tj')
 *         .end(callback)
 *
 *       // auto x-www-form-urlencoded
 *       request.post('/user')
 *         .type('form')
 *         .send({ name: 'tj' })
 *         .end(callback)
 *
 *       // defaults to x-www-form-urlencoded
 *      request.post('/user')
 *        .send('name=tobi')
 *        .send('species=ferret')
 *        .end(callback)
 *
 * @param {String|Object} data
 * @return {Request} for chaining
 * @api public
 */

exports.send = function(data){
  var obj = isObject(data);
  var type = this._header['content-type'];

  // merge
  if (obj && isObject(this._data)) {
    for (var key in data) {
      this._data[key] = data[key];
    }
  } else if ('string' == typeof data) {
    // default to x-www-form-urlencoded
    if (!type) this.type('form');
    type = this._header['content-type'];
    if ('application/x-www-form-urlencoded' == type) {
      this._data = this._data
        ? this._data + '&' + data
        : data;
    } else {
      this._data = (this._data || '') + data;
    }
  } else {
    this._data = data;
  }

  if (!obj || this._isHost(data)) return this;

  // default to json
  if (!type) this.type('json');
  return this;
};

},{"./is-object":3}],5:[function(require,module,exports){
// The node and browser modules expose versions of this with the
// appropriate constructor function bound as first argument
/**
 * Issue a request:
 *
 * Examples:
 *
 *    request('GET', '/users').end(callback)
 *    request('/users').end(callback)
 *    request('/users', callback)
 *
 * @param {String} method
 * @param {String|Function} url or callback
 * @return {Request}
 * @api public
 */

function request(RequestConstructor, method, url) {
  // callback
  if ('function' == typeof url) {
    return new RequestConstructor('GET', method).end(url);
  }

  // url first
  if (2 == arguments.length) {
    return new RequestConstructor('GET', method);
  }

  return new RequestConstructor(method, url);
}

module.exports = request;

},{}],6:[function(require,module,exports){
(function (Buffer){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['superagent'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('superagent'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.ApiClient = factory(root.superagent);
  }
}(this, function(superagent) {
  'use strict';

  /**
   * @module ApiClient
   * @version v1
   */

  /**
   * Manages low level client-server communications, parameter marshalling, etc. There should not be any need for an
   * application to use this class directly - the *Api and model classes provide the public API for the service. The
   * contents of this file should be regarded as internal but are documented for completeness.
   * @alias module:ApiClient
   * @class
   */
  var exports = function() {
    /**
     * The base URL against which to resolve every API call's (relative) path.
     * @type {String}
     * @default http://localhost/NextRewards
     */
    this.basePath = 'http://localhost:8077/NextService/NextRewards'.replace(/\/+$/, '');

    /**
     * The authentication methods to be included for all API calls.
     * @type {Array.<String>}
     */
    this.authentications = {
    };
    /**
     * The default HTTP headers to be included for all API calls.
     * @type {Array.<String>}
     * @default {}
     */
    this.defaultHeaders = {};

    /**
     * The default HTTP timeout for all API calls.
     * @type {Number}
     * @default 60000
     */
    this.timeout = 60000;
  };

  /**
   * Returns a string representation for an actual parameter.
   * @param param The actual parameter.
   * @returns {String} The string representation of <code>param</code>.
   */
  exports.prototype.paramToString = function(param) {
    if (param == undefined || param == null) {
      return '';
    }
    if (param instanceof Date) {
      return param.toJSON();
    }
    return param.toString();
  };

  /**
   * Builds full URL by appending the given path to the base URL and replacing path parameter place-holders with parameter values.
   * NOTE: query parameters are not handled here.
   * @param {String} path The path to append to the base URL.
   * @param {Object} pathParams The parameter values to append.
   * @returns {String} The encoded path with parameter values substituted.
   */
  exports.prototype.buildUrl = function(path, pathParams) {
    if (!path.match(/^\//)) {
      path = '/' + path;
    }
    var url = this.basePath + path;
    var _this = this;
    url = url.replace(/\{([\w-]+)\}/g, function(fullMatch, key) {
      var value;
      if (pathParams.hasOwnProperty(key)) {
        value = _this.paramToString(pathParams[key]);
      } else {
        value = fullMatch;
      }
      return encodeURIComponent(value);
    });
    return url;
  };

  /**
   * Checks whether the given content type represents JSON.<br>
   * JSON content type examples:<br>
   * <ul>
   * <li>application/json</li>
   * <li>application/json; charset=UTF8</li>
   * <li>APPLICATION/JSON</li>
   * </ul>
   * @param {String} contentType The MIME content type to check.
   * @returns {Boolean} <code>true</code> if <code>contentType</code> represents JSON, otherwise <code>false</code>.
   */
  exports.prototype.isJsonMime = function(contentType) {
    return Boolean(contentType != null && contentType.match(/^application\/json(;.*)?$/i));
  };

  /**
   * Chooses a content type from the given array, with JSON preferred; i.e. return JSON if included, otherwise return the first.
   * @param {Array.<String>} contentTypes
   * @returns {String} The chosen content type, preferring JSON.
   */
  exports.prototype.jsonPreferredMime = function(contentTypes) {
    for (var i = 0; i < contentTypes.length; i++) {
      if (this.isJsonMime(contentTypes[i])) {
        return contentTypes[i];
      }
    }
    return contentTypes[0];
  };

  /**
   * Checks whether the given parameter value represents file-like content.
   * @param param The parameter to check.
   * @returns {Boolean} <code>true</code> if <code>param</code> represents a file.
   */
  exports.prototype.isFileParam = function(param) {
    // fs.ReadStream in Node.js (but not in runtime like browserify)
    if (typeof window === 'undefined' &&
        typeof require === 'function' &&
        require('fs') &&
        param instanceof require('fs').ReadStream) {
      return true;
    }
    // Buffer in Node.js
    if (typeof Buffer === 'function' && param instanceof Buffer) {
      return true;
    }
    // Blob in browser
    if (typeof Blob === 'function' && param instanceof Blob) {
      return true;
    }
    // File in browser (it seems File object is also instance of Blob, but keep this for safe)
    if (typeof File === 'function' && param instanceof File) {
      return true;
    }
    return false;
  };

  /**
   * Normalizes parameter values:
   * <ul>
   * <li>remove nils</li>
   * <li>keep files and arrays</li>
   * <li>format to string with `paramToString` for other cases</li>
   * </ul>
   * @param {Object.<String, Object>} params The parameters as object properties.
   * @returns {Object.<String, Object>} normalized parameters.
   */
  exports.prototype.normalizeParams = function(params) {
    var newParams = {};
    for (var key in params) {
      if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
        var value = params[key];
        if (this.isFileParam(value) || Array.isArray(value)) {
          newParams[key] = value;
        } else {
          newParams[key] = this.paramToString(value);
        }
      }
    }
    return newParams;
  };

  /**
   * Enumeration of collection format separator strategies.
   * @enum {String}
   * @readonly
   */
  exports.CollectionFormatEnum = {
    /**
     * Comma-separated values. Value: <code>csv</code>
     * @const
     */
    CSV: ',',
    /**
     * Space-separated values. Value: <code>ssv</code>
     * @const
     */
    SSV: ' ',
    /**
     * Tab-separated values. Value: <code>tsv</code>
     * @const
     */
    TSV: '\t',
    /**
     * Pipe(|)-separated values. Value: <code>pipes</code>
     * @const
     */
    PIPES: '|',
    /**
     * Native array. Value: <code>multi</code>
     * @const
     */
    MULTI: 'multi'
  };

  /**
   * Builds a string representation of an array-type actual parameter, according to the given collection format.
   * @param {Array} param An array parameter.
   * @param {module:ApiClient.CollectionFormatEnum} collectionFormat The array element separator strategy.
   * @returns {String|Array} A string representation of the supplied collection, using the specified delimiter. Returns
   * <code>param</code> as is if <code>collectionFormat</code> is <code>multi</code>.
   */
  exports.prototype.buildCollectionParam = function buildCollectionParam(param, collectionFormat) {
    if (param == null) {
      return null;
    }
    switch (collectionFormat) {
      case 'csv':
        return param.map(this.paramToString).join(',');
      case 'ssv':
        return param.map(this.paramToString).join(' ');
      case 'tsv':
        return param.map(this.paramToString).join('\t');
      case 'pipes':
        return param.map(this.paramToString).join('|');
      case 'multi':
        // return the array directly as SuperAgent will handle it as expected
        return param.map(this.paramToString);
      default:
        throw new Error('Unknown collection format: ' + collectionFormat);
    }
  };

  /**
   * Applies authentication headers to the request.
   * @param {Object} request The request object created by a <code>superagent()</code> call.
   * @param {Array.<String>} authNames An array of authentication method names.
   */
  exports.prototype.applyAuthToRequest = function(request, authNames) {
    var _this = this;
    authNames.forEach(function(authName) {
      var auth = _this.authentications[authName];
      switch (auth.type) {
        case 'basic':
          if (auth.username || auth.password) {
            request.auth(auth.username || '', auth.password || '');
          }
          break;
        case 'apiKey':
          if (auth.apiKey) {
            var data = {};
            if (auth.apiKeyPrefix) {
              data[auth.name] = auth.apiKeyPrefix + ' ' + auth.apiKey;
            } else {
              data[auth.name] = auth.apiKey;
            }
            if (auth['in'] === 'header') {
              request.set(data);
            } else {
              request.query(data);
            }
          }
          break;
        case 'oauth2':
          if (auth.accessToken) {
            request.set({'Authorization': 'Bearer ' + auth.accessToken});
          }
          break;
        default:
          throw new Error('Unknown authentication type: ' + auth.type);
      }
    });
  };

  /**
   * Deserializes an HTTP response body into a value of the specified type.
   * @param {Object} response A SuperAgent response object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} returnType The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns A value of the specified type.
   */
  exports.prototype.deserialize = function deserialize(response, returnType) {
    if (response == null || returnType == null) {
      return null;
    }
    // Rely on SuperAgent for parsing response body.
    // See http://visionmedia.github.io/superagent/#parsing-response-bodies
    var data = response.body;
    if (data == null) {
      // SuperAgent does not always produce a body; use the unparsed response as a fallback
      data = response.text;
    }
    return exports.convertToType(data, returnType);
  };

  /**
   * Callback function to receive the result of the operation.
   * @callback module:ApiClient~callApiCallback
   * @param {String} error Error message, if any.
   * @param data The data returned by the service call.
   * @param {String} response The complete HTTP response.
   */

  /**
   * Invokes the REST service using the supplied settings and parameters.
   * @param {String} path The base URL to invoke.
   * @param {String} httpMethod The HTTP method to use.
   * @param {Object.<String, String>} pathParams A map of path parameters and their values.
   * @param {Object.<String, Object>} queryParams A map of query parameters and their values.
   * @param {Object.<String, Object>} headerParams A map of header parameters and their values.
   * @param {Object.<String, Object>} formParams A map of form parameters and their values.
   * @param {Object} bodyParam The value to pass as the request body.
   * @param {Array.<String>} authNames An array of authentication type names.
   * @param {Array.<String>} contentTypes An array of request MIME types.
   * @param {Array.<String>} accepts An array of acceptable response MIME types.
   * @param {(String|Array|ObjectFunction)} returnType The required type to return; can be a string for simple types or the
   * constructor for a complex type.
   * @param {module:ApiClient~callApiCallback} callback The callback function.
   * @returns {Object} The SuperAgent request object.
   */
  exports.prototype.callApi = function callApi(path, httpMethod, pathParams,
      queryParams, headerParams, formParams, bodyParam, authNames, contentTypes, accepts,
      returnType, callback) {

    var _this = this;
    var url = this.buildUrl(path, pathParams);
    var request = superagent(httpMethod, url);

    // apply authentications
    this.applyAuthToRequest(request, authNames);

    // set query parameters
    request.query(this.normalizeParams(queryParams));

    // set header parameters
    request.set(this.defaultHeaders).set(this.normalizeParams(headerParams));

    // set request timeout
    request.timeout(this.timeout);

    var contentType = this.jsonPreferredMime(contentTypes);
    if (contentType) {
      request.type(contentType);
    } else if (!request.header['Content-Type']) {
      request.type('application/json');
    }

    if (contentType === 'application/x-www-form-urlencoded') {
      request.send(this.normalizeParams(formParams));
    } else if (contentType == 'multipart/form-data') {
      var _formParams = this.normalizeParams(formParams);
      for (var key in _formParams) {
        if (_formParams.hasOwnProperty(key)) {
          if (this.isFileParam(_formParams[key])) {
            // file field
            request.attach(key, _formParams[key]);
          } else {
            request.field(key, _formParams[key]);
          }
        }
      }
    } else if (bodyParam) {
      request.send(bodyParam);
    }

    var accept = this.jsonPreferredMime(accepts);
    if (accept) {
      request.accept(accept);
    }


    request.end(function(error, response) {
      if (callback) {
        var data = null;
        if (!error) {
          data = _this.deserialize(response, returnType);
        }
        callback(error, data, response);
      }
    });

    return request;
  };

  /**
   * Parses an ISO-8601 string representation of a date value.
   * @param {String} str The date value as a string.
   * @returns {Date} The parsed date object.
   */
  exports.parseDate = function(str) {
    return new Date(str.replace(/T/i, ' '));
  };

  /**
   * Converts a value to the specified type.
   * @param {(String|Object)} data The data to convert, as a string or object.
   * @param {(String|Array.<String>|Object.<String, Object>|Function)} type The type to return. Pass a string for simple types
   * or the constructor function for a complex type. Pass an array containing the type name to return an array of that type. To
   * return an object, pass an object with one property whose name is the key type and whose value is the corresponding value type:
   * all properties on <code>data<code> will be converted to this type.
   * @returns An instance of the specified type.
   */
  exports.convertToType = function(data, type) {
    switch (type) {
      case 'Boolean':
        return Boolean(data);
      case 'Integer':
        return parseInt(data, 10);
      case 'Number':
        return parseFloat(data);
      case 'String':
        return String(data);
      case 'Date':
        return this.parseDate(String(data));
      default:
        if (type === Object) {
          // generic object, return directly
          return data;
        } else if (typeof type === 'function') {
          // for model type like: User
          return type.constructFromObject(data);
        } else if (Array.isArray(type)) {
          // for array type like: ['String']
          var itemType = type[0];
          return data.map(function(item) {
            return exports.convertToType(item, itemType);
          });
        } else if (typeof type === 'object') {
          // for plain object type like: {'String': 'Integer'}
          var keyType, valueType;
          for (var k in type) {
            if (type.hasOwnProperty(k)) {
              keyType = k;
              valueType = type[k];
              break;
            }
          }
          var result = {};
          for (var k in data) {
            if (data.hasOwnProperty(k)) {
              var key = exports.convertToType(k, keyType);
              var value = exports.convertToType(data[k], valueType);
              result[key] = value;
            }
          }
          return result;
        } else {
          // for unknown type, return the data directly
          return data;
        }
    }
  };

  /**
   * Constructs a new map or array model from REST data.
   * @param data {Object|Array} The REST data.
   * @param obj {Object|Array} The target object or array.
   */
  exports.constructFromObject = function(data, obj, itemType) {
    if (Array.isArray(data)) {
      for (var i = 0; i < data.length; i++) {
        if (data.hasOwnProperty(i))
          obj[i] = exports.convertToType(data[i], itemType);
      }
    } else {
      for (var k in data) {
        if (data.hasOwnProperty(k))
          obj[k] = exports.convertToType(data[k], itemType);
      }
    }
  };

  /**
   * The default API client implementation.
   * @type {module:ApiClient}
   */
  exports.instance = new exports();

  return exports;
}));

}).call(this,require("buffer").Buffer)
},{"buffer":35,"fs":33,"superagent":2}],7:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AutoNumberingAddRequest', 'model/JerseyResponse', 'model/CustomFieldAddRequest', 'model/CustomFieldDataAddRequest', 'model/CustomFieldListAddRequest', 'model/CustomFieldMappingAddRequest', 'model/ProductFeatureAddRequest', 'model/CustomFieldListResponse', 'model/CustomFieldResponse', 'model/EntityResponse', 'model/MasterTemplateResponse', 'model/ProductFeatureResponse', 'model/AutoNumberingResponse', 'model/AutoNumberingGenerateRequest', 'model/CustomFieldDataResponse', 'model/CustomFieldMappingResponse', 'model/AutoNumberingUpdateRequest', 'model/CustomFieldUpdateRequest', 'model/CustomFieldDataUpdateRequest', 'model/ProductFeatureUpdateRequest'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('../model/AutoNumberingAddRequest'), require('../model/JerseyResponse'), require('../model/CustomFieldAddRequest'), require('../model/CustomFieldDataAddRequest'), require('../model/CustomFieldListAddRequest'), require('../model/CustomFieldMappingAddRequest'), require('../model/ProductFeatureAddRequest'), require('../model/CustomFieldListResponse'), require('../model/CustomFieldResponse'), require('../model/EntityResponse'), require('../model/MasterTemplateResponse'), require('../model/ProductFeatureResponse'), require('../model/AutoNumberingResponse'), require('../model/AutoNumberingGenerateRequest'), require('../model/CustomFieldDataResponse'), require('../model/CustomFieldMappingResponse'), require('../model/AutoNumberingUpdateRequest'), require('../model/CustomFieldUpdateRequest'), require('../model/CustomFieldDataUpdateRequest'), require('../model/ProductFeatureUpdateRequest'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.DefaultApi = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.AutoNumberingAddRequest, root.SpringBootJerseySwaggerDockerExample.JerseyResponse, root.SpringBootJerseySwaggerDockerExample.CustomFieldAddRequest, root.SpringBootJerseySwaggerDockerExample.CustomFieldDataAddRequest, root.SpringBootJerseySwaggerDockerExample.CustomFieldListAddRequest, root.SpringBootJerseySwaggerDockerExample.CustomFieldMappingAddRequest, root.SpringBootJerseySwaggerDockerExample.ProductFeatureAddRequest, root.SpringBootJerseySwaggerDockerExample.CustomFieldListResponse, root.SpringBootJerseySwaggerDockerExample.CustomFieldResponse, root.SpringBootJerseySwaggerDockerExample.EntityResponse, root.SpringBootJerseySwaggerDockerExample.MasterTemplateResponse, root.SpringBootJerseySwaggerDockerExample.ProductFeatureResponse, root.SpringBootJerseySwaggerDockerExample.AutoNumberingResponse, root.SpringBootJerseySwaggerDockerExample.AutoNumberingGenerateRequest, root.SpringBootJerseySwaggerDockerExample.CustomFieldDataResponse, root.SpringBootJerseySwaggerDockerExample.CustomFieldMappingResponse, root.SpringBootJerseySwaggerDockerExample.AutoNumberingUpdateRequest, root.SpringBootJerseySwaggerDockerExample.CustomFieldUpdateRequest, root.SpringBootJerseySwaggerDockerExample.CustomFieldDataUpdateRequest, root.SpringBootJerseySwaggerDockerExample.ProductFeatureUpdateRequest);
  }
}(this, function(ApiClient, AutoNumberingAddRequest, JerseyResponse, CustomFieldAddRequest, CustomFieldDataAddRequest, CustomFieldListAddRequest, CustomFieldMappingAddRequest, ProductFeatureAddRequest, CustomFieldListResponse, CustomFieldResponse, EntityResponse, MasterTemplateResponse, ProductFeatureResponse, AutoNumberingResponse, AutoNumberingGenerateRequest, CustomFieldDataResponse, CustomFieldMappingResponse, AutoNumberingUpdateRequest, CustomFieldUpdateRequest, CustomFieldDataUpdateRequest, ProductFeatureUpdateRequest) {
  'use strict';

  /**
   * Default service.
   * @module api/DefaultApi
   * @version v1
   */

  /**
   * Constructs a new DefaultApi. 
   * @alias module:api/DefaultApi
   * @class
   * @param {module:ApiClient} apiClient Optional API client implementation to use,
   * default to {@link module:ApiClient#instance} if unspecified.
   */
  var exports = function(apiClient) {
    this.apiClient = apiClient || ApiClient.instance;


    /**
     * Callback function to receive the result of the addAutoNumberings operation.
     * @callback module:api/DefaultApi~addAutoNumberingsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/AutoNumberingAddRequest} opts.body 
     * @param {module:api/DefaultApi~addAutoNumberingsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.addAutoNumberings = function(opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/auto_numberings', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the addCustomField operation.
     * @callback module:api/DefaultApi~addCustomFieldCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/CustomFieldAddRequest} opts.body 
     * @param {module:api/DefaultApi~addCustomFieldCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.addCustomField = function(opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the addCustomFieldData operation.
     * @callback module:api/DefaultApi~addCustomFieldDataCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/CustomFieldDataAddRequest} opts.body 
     * @param {module:api/DefaultApi~addCustomFieldDataCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.addCustomFieldData = function(opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields_data', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the addCustomFieldList operation.
     * @callback module:api/DefaultApi~addCustomFieldListCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {Array.<module:model/CustomFieldListAddRequest>} opts.body 
     * @param {module:api/DefaultApi~addCustomFieldListCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.addCustomFieldList = function(opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_field_lists', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the addCustomFieldMapping operation.
     * @callback module:api/DefaultApi~addCustomFieldMappingCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/CustomFieldMappingAddRequest} opts.body 
     * @param {module:api/DefaultApi~addCustomFieldMappingCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.addCustomFieldMapping = function(opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields_mapping', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the addProductFeature operation.
     * @callback module:api/DefaultApi~addProductFeatureCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/ProductFeatureAddRequest} opts.body 
     * @param {module:api/DefaultApi~addProductFeatureCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.addProductFeature = function(opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/product_features', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteAutoNumberings operation.
     * @callback module:api/DefaultApi~deleteAutoNumberingsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.Long 
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~deleteAutoNumberingsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.deleteAutoNumberings = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling deleteAutoNumberings";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'Long': opts['Long'],
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/auto_numberings/{pathLong}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteCustomField operation.
     * @callback module:api/DefaultApi~deleteCustomFieldCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~deleteCustomFieldCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.deleteCustomField = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling deleteCustomField";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields/{pathLong}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteCustomFieldData operation.
     * @callback module:api/DefaultApi~deleteCustomFieldDataCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~deleteCustomFieldDataCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.deleteCustomFieldData = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling deleteCustomFieldData";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields_data/{pathLong}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteCustomFieldList operation.
     * @callback module:api/DefaultApi~deleteCustomFieldListCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.Long 
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~deleteCustomFieldListCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.deleteCustomFieldList = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling deleteCustomFieldList";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'Long': opts['Long'],
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_field_lists/{pathLong}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteCustomFieldMapping operation.
     * @callback module:api/DefaultApi~deleteCustomFieldMappingCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~deleteCustomFieldMappingCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.deleteCustomFieldMapping = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling deleteCustomFieldMapping";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields_mapping/{pathLong}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the deleteProductFeature operation.
     * @callback module:api/DefaultApi~deleteProductFeatureCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~deleteProductFeatureCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.deleteProductFeature = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling deleteProductFeature";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/product_features/{pathLong}', 'DELETE',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the fetchAllCustomFieldLists operation.
     * @callback module:api/DefaultApi~fetchAllCustomFieldListsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/CustomFieldListResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.Long 
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~fetchAllCustomFieldListsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/CustomFieldListResponse>}
     */
    this.fetchAllCustomFieldLists = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling fetchAllCustomFieldLists";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'Long': opts['Long'],
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [CustomFieldListResponse];

      return this.apiClient.callApi(
        '/v1/custom_field_lists/{pathLong}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the fetchAllCustomFields operation.
     * @callback module:api/DefaultApi~fetchAllCustomFieldsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/CustomFieldResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~fetchAllCustomFieldsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/CustomFieldResponse>}
     */
    this.fetchAllCustomFields = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [CustomFieldResponse];

      return this.apiClient.callApi(
        '/v1/custom_fields', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the fetchAllEntities operation.
     * @callback module:api/DefaultApi~fetchAllEntitiesCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/EntityResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~fetchAllEntitiesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/EntityResponse>}
     */
    this.fetchAllEntities = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [EntityResponse];

      return this.apiClient.callApi(
        '/v1/entities', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the fetchAllMasterTemplates operation.
     * @callback module:api/DefaultApi~fetchAllMasterTemplatesCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/MasterTemplateResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~fetchAllMasterTemplatesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/MasterTemplateResponse>}
     */
    this.fetchAllMasterTemplates = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling fetchAllMasterTemplates";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [MasterTemplateResponse];

      return this.apiClient.callApi(
        '/v1/master_templates', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the fetchAllProductFeatures operation.
     * @callback module:api/DefaultApi~fetchAllProductFeaturesCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/ProductFeatureResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~fetchAllProductFeaturesCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/ProductFeatureResponse>}
     */
    this.fetchAllProductFeatures = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [ProductFeatureResponse];

      return this.apiClient.callApi(
        '/v1/product_features', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the fetchAutoNumberings operation.
     * @callback module:api/DefaultApi~fetchAutoNumberingsCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/AutoNumberingResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~fetchAutoNumberingsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/AutoNumberingResponse>}
     */
    this.fetchAutoNumberings = function(opts, callback) {
      opts = opts || {};
      var postBody = null;


      var pathParams = {
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [AutoNumberingResponse];

      return this.apiClient.callApi(
        '/v1/auto_numberings', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the generateAutoGeneratedNos operation.
     * @callback module:api/DefaultApi~generateAutoGeneratedNosCallback
     * @param {String} error Error message, if any.
     * @param {module:model/AutoNumberingResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.Long 
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/AutoNumberingGenerateRequest} opts.body 
     * @param {module:api/DefaultApi~generateAutoGeneratedNosCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/AutoNumberingResponse}
     */
    this.generateAutoGeneratedNos = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling generateAutoGeneratedNos";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'Long': opts['Long'],
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = AutoNumberingResponse;

      return this.apiClient.callApi(
        '/v1/auto_numberings/generate', 'POST',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getAllCustomFieldData operation.
     * @callback module:api/DefaultApi~getAllCustomFieldDataCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/CustomFieldDataResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~getAllCustomFieldDataCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/CustomFieldDataResponse>}
     */
    this.getAllCustomFieldData = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling getAllCustomFieldData";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [CustomFieldDataResponse];

      return this.apiClient.callApi(
        '/v1/custom_fields/{pathLong}/custom_fields_data', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getAllCustomFieldMapping operation.
     * @callback module:api/DefaultApi~getAllCustomFieldMappingCallback
     * @param {String} error Error message, if any.
     * @param {Array.<module:model/CustomFieldMappingResponse>} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~getAllCustomFieldMappingCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link Array.<module:model/CustomFieldMappingResponse>}
     */
    this.getAllCustomFieldMapping = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling getAllCustomFieldMapping";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = [CustomFieldMappingResponse];

      return this.apiClient.callApi(
        '/v1/custom_fields/{pathLong}/custom_fields_mapping', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getCustomField operation.
     * @callback module:api/DefaultApi~getCustomFieldCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CustomFieldResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~getCustomFieldCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CustomFieldResponse}
     */
    this.getCustomField = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling getCustomField";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CustomFieldResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields/{pathLong}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getCustomFieldData operation.
     * @callback module:api/DefaultApi~getCustomFieldDataCallback
     * @param {String} error Error message, if any.
     * @param {module:model/CustomFieldDataResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~getCustomFieldDataCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/CustomFieldDataResponse}
     */
    this.getCustomFieldData = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling getCustomFieldData";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = CustomFieldDataResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields_data/{pathLong}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the getProductFeature operation.
     * @callback module:api/DefaultApi~getProductFeatureCallback
     * @param {String} error Error message, if any.
     * @param {module:model/ProductFeatureResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:api/DefaultApi~getProductFeatureCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/ProductFeatureResponse}
     */
    this.getProductFeature = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = null;

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling getProductFeature";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = ProductFeatureResponse;

      return this.apiClient.callApi(
        '/v1/product_features/{pathLong}', 'GET',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateAutoNumberings operation.
     * @callback module:api/DefaultApi~updateAutoNumberingsCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.Long 
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/AutoNumberingUpdateRequest} opts.body 
     * @param {module:api/DefaultApi~updateAutoNumberingsCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.updateAutoNumberings = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling updateAutoNumberings";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'Long': opts['Long'],
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/auto_numberings', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateCustomField operation.
     * @callback module:api/DefaultApi~updateCustomFieldCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/CustomFieldUpdateRequest} opts.body 
     * @param {module:api/DefaultApi~updateCustomFieldCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.updateCustomField = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling updateCustomField";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateCustomFieldData operation.
     * @callback module:api/DefaultApi~updateCustomFieldDataCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/CustomFieldDataUpdateRequest} opts.body 
     * @param {module:api/DefaultApi~updateCustomFieldDataCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.updateCustomFieldData = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling updateCustomFieldData";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/custom_fields_data/{pathLong}', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }

    /**
     * Callback function to receive the result of the updateProductFeature operation.
     * @callback module:api/DefaultApi~updateProductFeatureCallback
     * @param {String} error Error message, if any.
     * @param {module:model/JerseyResponse} data The data returned by the service call.
     * @param {String} response The complete HTTP response.
     */

    /**
     * @param {String} pathLong 
     * @param {Object} opts Optional parameters
     * @param {String} opts.lbid 
     * @param {String} opts.lasid 
     * @param {String} opts.luid 
     * @param {String} opts.sortBy 
     * @param {String} opts.filter 
     * @param {Integer} opts.page 
     * @param {Integer} opts.pageSize 
     * @param {module:model/ProductFeatureUpdateRequest} opts.body 
     * @param {module:api/DefaultApi~updateProductFeatureCallback} callback The callback function, accepting three arguments: error, data, response
     * data is of type: {@link module:model/JerseyResponse}
     */
    this.updateProductFeature = function(pathLong, opts, callback) {
      opts = opts || {};
      var postBody = opts['body'];

      // verify the required parameter 'pathLong' is set
      if (pathLong == undefined || pathLong == null) {
        throw "Missing the required parameter 'pathLong' when calling updateProductFeature";
      }


      var pathParams = {
        'pathLong': pathLong
      };
      var queryParams = {
        'lbid': opts['lbid'],
        'lasid': opts['lasid'],
        'luid': opts['luid'],
        'sort_by': opts['sortBy'],
        'filter': opts['filter'],
        'page': opts['page'],
        'page_size': opts['pageSize']
      };
      var headerParams = {
      };
      var formParams = {
      };

      var authNames = [];
      var contentTypes = ['application/json'];
      var accepts = ['application/json'];
      var returnType = JerseyResponse;

      return this.apiClient.callApi(
        '/v1/product_features/{pathLong}', 'PUT',
        pathParams, queryParams, headerParams, formParams, postBody,
        authNames, contentTypes, accepts, returnType, callback
      );
    }
  };

  return exports;
}));

},{"../ApiClient":6,"../model/AutoNumberingAddRequest":10,"../model/AutoNumberingGenerateRequest":11,"../model/AutoNumberingResponse":12,"../model/AutoNumberingUpdateRequest":13,"../model/CustomFieldAddRequest":15,"../model/CustomFieldDataAddRequest":16,"../model/CustomFieldDataResponse":17,"../model/CustomFieldDataUpdateRequest":18,"../model/CustomFieldListAddRequest":19,"../model/CustomFieldListResponse":20,"../model/CustomFieldMappingAddRequest":21,"../model/CustomFieldMappingResponse":22,"../model/CustomFieldResponse":23,"../model/CustomFieldUpdateRequest":24,"../model/EntityResponse":26,"../model/JerseyResponse":27,"../model/MasterTemplateResponse":29,"../model/ProductFeatureAddRequest":30,"../model/ProductFeatureResponse":31,"../model/ProductFeatureUpdateRequest":32}],8:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AutoNumbering', 'model/AutoNumberingAddRequest', 'model/AutoNumberingGenerateRequest', 'model/AutoNumberingResponse', 'model/AutoNumberingUpdateRequest', 'model/CustomField', 'model/CustomFieldAddRequest', 'model/CustomFieldDataAddRequest', 'model/CustomFieldDataResponse', 'model/CustomFieldDataUpdateRequest', 'model/CustomFieldListAddRequest', 'model/CustomFieldListResponse', 'model/CustomFieldMappingAddRequest', 'model/CustomFieldMappingResponse', 'model/CustomFieldResponse', 'model/CustomFieldUpdateRequest', 'model/Entities', 'model/EntityResponse', 'model/JerseyResponse', 'model/MasterTemplate', 'model/MasterTemplateResponse', 'model/ProductFeatureAddRequest', 'model/ProductFeatureResponse', 'model/ProductFeatureUpdateRequest', 'api/DefaultApi'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('./ApiClient'), require('./model/AutoNumbering'), require('./model/AutoNumberingAddRequest'), require('./model/AutoNumberingGenerateRequest'), require('./model/AutoNumberingResponse'), require('./model/AutoNumberingUpdateRequest'), require('./model/CustomField'), require('./model/CustomFieldAddRequest'), require('./model/CustomFieldDataAddRequest'), require('./model/CustomFieldDataResponse'), require('./model/CustomFieldDataUpdateRequest'), require('./model/CustomFieldListAddRequest'), require('./model/CustomFieldListResponse'), require('./model/CustomFieldMappingAddRequest'), require('./model/CustomFieldMappingResponse'), require('./model/CustomFieldResponse'), require('./model/CustomFieldUpdateRequest'), require('./model/Entities'), require('./model/EntityResponse'), require('./model/JerseyResponse'), require('./model/MasterTemplate'), require('./model/MasterTemplateResponse'), require('./model/ProductFeatureAddRequest'), require('./model/ProductFeatureResponse'), require('./model/ProductFeatureUpdateRequest'), require('./api/DefaultApi'));
  	window.NextRewardsApi=module.exports;
  }
}(function(ApiClient, AutoNumbering, AutoNumberingAddRequest, AutoNumberingGenerateRequest, AutoNumberingResponse, AutoNumberingUpdateRequest, CustomField, CustomFieldAddRequest, CustomFieldDataAddRequest, CustomFieldDataResponse, CustomFieldDataUpdateRequest, CustomFieldListAddRequest, CustomFieldListResponse, CustomFieldMappingAddRequest, CustomFieldMappingResponse, CustomFieldResponse, CustomFieldUpdateRequest, Entities, EntityResponse, JerseyResponse, MasterTemplate, MasterTemplateResponse, ProductFeatureAddRequest, ProductFeatureResponse, ProductFeatureUpdateRequest, DefaultApi) {
  'use strict';

  /**
   * ERROR_UNKNOWN.<br>
   * The <code>index</code> module provides access to constructors for all the classes which comprise the public API.
   * <p>
   * An AMD (recommended!) or CommonJS application will generally do something equivalent to the following:
   * <pre>
   * var SpringBootJerseySwaggerDockerExample = require('index'); // See note below*.
   * var xxxSvc = new SpringBootJerseySwaggerDockerExample.XxxApi(); // Allocate the API class we're going to use.
   * var yyyModel = new SpringBootJerseySwaggerDockerExample.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * <em>*NOTE: For a top-level AMD script, use require(['index'], function(){...})
   * and put the application logic within the callback function.</em>
   * </p>
   * <p>
   * A non-AMD browser application (discouraged) might do something like this:
   * <pre>
   * var xxxSvc = new SpringBootJerseySwaggerDockerExample.XxxApi(); // Allocate the API class we're going to use.
   * var yyy = new SpringBootJerseySwaggerDockerExample.Yyy(); // Construct a model instance.
   * yyyModel.someProperty = 'someValue';
   * ...
   * var zzz = xxxSvc.doSomething(yyyModel); // Invoke the service.
   * ...
   * </pre>
   * </p>
   * @module index
   * @version v1
   */
  var exports = {
    /**
     * The ApiClient constructor.
     * @property {module:ApiClient}
     */
    ApiClient: ApiClient,
    /**
     * The AutoNumbering model constructor.
     * @property {module:model/AutoNumbering}
     */
    AutoNumbering: AutoNumbering,
    /**
     * The AutoNumberingAddRequest model constructor.
     * @property {module:model/AutoNumberingAddRequest}
     */
    AutoNumberingAddRequest: AutoNumberingAddRequest,
    /**
     * The AutoNumberingGenerateRequest model constructor.
     * @property {module:model/AutoNumberingGenerateRequest}
     */
    AutoNumberingGenerateRequest: AutoNumberingGenerateRequest,
    /**
     * The AutoNumberingResponse model constructor.
     * @property {module:model/AutoNumberingResponse}
     */
    AutoNumberingResponse: AutoNumberingResponse,
    /**
     * The AutoNumberingUpdateRequest model constructor.
     * @property {module:model/AutoNumberingUpdateRequest}
     */
    AutoNumberingUpdateRequest: AutoNumberingUpdateRequest,
    /**
     * The CustomField model constructor.
     * @property {module:model/CustomField}
     */
    CustomField: CustomField,
    /**
     * The CustomFieldAddRequest model constructor.
     * @property {module:model/CustomFieldAddRequest}
     */
    CustomFieldAddRequest: CustomFieldAddRequest,
    /**
     * The CustomFieldDataAddRequest model constructor.
     * @property {module:model/CustomFieldDataAddRequest}
     */
    CustomFieldDataAddRequest: CustomFieldDataAddRequest,
    /**
     * The CustomFieldDataResponse model constructor.
     * @property {module:model/CustomFieldDataResponse}
     */
    CustomFieldDataResponse: CustomFieldDataResponse,
    /**
     * The CustomFieldDataUpdateRequest model constructor.
     * @property {module:model/CustomFieldDataUpdateRequest}
     */
    CustomFieldDataUpdateRequest: CustomFieldDataUpdateRequest,
    /**
     * The CustomFieldListAddRequest model constructor.
     * @property {module:model/CustomFieldListAddRequest}
     */
    CustomFieldListAddRequest: CustomFieldListAddRequest,
    /**
     * The CustomFieldListResponse model constructor.
     * @property {module:model/CustomFieldListResponse}
     */
    CustomFieldListResponse: CustomFieldListResponse,
    /**
     * The CustomFieldMappingAddRequest model constructor.
     * @property {module:model/CustomFieldMappingAddRequest}
     */
    CustomFieldMappingAddRequest: CustomFieldMappingAddRequest,
    /**
     * The CustomFieldMappingResponse model constructor.
     * @property {module:model/CustomFieldMappingResponse}
     */
    CustomFieldMappingResponse: CustomFieldMappingResponse,
    /**
     * The CustomFieldResponse model constructor.
     * @property {module:model/CustomFieldResponse}
     */
    CustomFieldResponse: CustomFieldResponse,
    /**
     * The CustomFieldUpdateRequest model constructor.
     * @property {module:model/CustomFieldUpdateRequest}
     */
    CustomFieldUpdateRequest: CustomFieldUpdateRequest,
    /**
     * The Entities model constructor.
     * @property {module:model/Entities}
     */
    Entities: Entities,
    /**
     * The EntityResponse model constructor.
     * @property {module:model/EntityResponse}
     */
    EntityResponse: EntityResponse,
    /**
     * The JerseyResponse model constructor.
     * @property {module:model/JerseyResponse}
     */
    JerseyResponse: JerseyResponse,
    /**
     * The MasterTemplate model constructor.
     * @property {module:model/MasterTemplate}
     */
    MasterTemplate: MasterTemplate,
    /**
     * The MasterTemplateResponse model constructor.
     * @property {module:model/MasterTemplateResponse}
     */
    MasterTemplateResponse: MasterTemplateResponse,
    /**
     * The ProductFeatureAddRequest model constructor.
     * @property {module:model/ProductFeatureAddRequest}
     */
    ProductFeatureAddRequest: ProductFeatureAddRequest,
    /**
     * The ProductFeatureResponse model constructor.
     * @property {module:model/ProductFeatureResponse}
     */
    ProductFeatureResponse: ProductFeatureResponse,
    /**
     * The ProductFeatureUpdateRequest model constructor.
     * @property {module:model/ProductFeatureUpdateRequest}
     */
    ProductFeatureUpdateRequest: ProductFeatureUpdateRequest,
    /**
     * The DefaultApi service constructor.
     * @property {module:api/DefaultApi}
     */
    DefaultApi: DefaultApi
  };

  return exports;
}));

},{"./ApiClient":6,"./api/DefaultApi":7,"./model/AutoNumbering":9,"./model/AutoNumberingAddRequest":10,"./model/AutoNumberingGenerateRequest":11,"./model/AutoNumberingResponse":12,"./model/AutoNumberingUpdateRequest":13,"./model/CustomField":14,"./model/CustomFieldAddRequest":15,"./model/CustomFieldDataAddRequest":16,"./model/CustomFieldDataResponse":17,"./model/CustomFieldDataUpdateRequest":18,"./model/CustomFieldListAddRequest":19,"./model/CustomFieldListResponse":20,"./model/CustomFieldMappingAddRequest":21,"./model/CustomFieldMappingResponse":22,"./model/CustomFieldResponse":23,"./model/CustomFieldUpdateRequest":24,"./model/Entities":25,"./model/EntityResponse":26,"./model/JerseyResponse":27,"./model/MasterTemplate":28,"./model/MasterTemplateResponse":29,"./model/ProductFeatureAddRequest":30,"./model/ProductFeatureResponse":31,"./model/ProductFeatureUpdateRequest":32}],9:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.AutoNumbering = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The AutoNumbering model module.
   * @module model/AutoNumbering
   * @version v1
   */

  /**
   * Constructs a new <code>AutoNumbering</code>.
   * @alias module:model/AutoNumbering
   * @class
   */
  var exports = function() {
    var _this = this;
















  };

  /**
   * Constructs a <code>AutoNumbering</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoNumbering} obj Optional instance to populate.
   * @return {module:model/AutoNumbering} The populated <code>AutoNumbering</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Integer');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('subType')) {
        obj['subType'] = ApiClient.convertToType(data['subType'], 'Integer');
      }
      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
      if (data.hasOwnProperty('fixedValue')) {
        obj['fixedValue'] = ApiClient.convertToType(data['fixedValue'], 'String');
      }
      if (data.hasOwnProperty('variableStart')) {
        obj['variableStart'] = ApiClient.convertToType(data['variableStart'], 'Integer');
      }
      if (data.hasOwnProperty('lastRunVariable')) {
        obj['lastRunVariable'] = ApiClient.convertToType(data['lastRunVariable'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('itemGroup')) {
        obj['itemGroup'] = ApiClient.convertToType(data['itemGroup'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
      if (data.hasOwnProperty('academicSession')) {
        obj['academicSession'] = ApiClient.convertToType(data['academicSession'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {Integer} id
   */
  exports.prototype['id'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {Integer} subType
   */
  exports.prototype['subType'] = undefined;
  /**
   * @member {module:model/AutoNumbering.TypeEnum} type
   */
  exports.prototype['type'] = undefined;
  /**
   * @member {String} fixedValue
   */
  exports.prototype['fixedValue'] = undefined;
  /**
   * @member {Integer} variableStart
   */
  exports.prototype['variableStart'] = undefined;
  /**
   * @member {String} lastRunVariable
   */
  exports.prototype['lastRunVariable'] = undefined;
  /**
   * @member {module:model/AutoNumbering.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} itemGroup
   */
  exports.prototype['itemGroup'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;
  /**
   * @member {String} academicSession
   */
  exports.prototype['academicSession'] = undefined;


  /**
   * Allowed values for the <code>type</code> property.
   * @enum {String}
   * @readonly
   */
  exports.TypeEnum = {
    /**
     * value: "VoucherNo"
     * @const
     */
    "VoucherNo": "VoucherNo",
    /**
     * value: "AdmissionRegistrationNo"
     * @const
     */
    "AdmissionRegistrationNo": "AdmissionRegistrationNo",
    /**
     * value: "ReceiptNo"
     * @const
     */
    "ReceiptNo": "ReceiptNo",
    /**
     * value: "AccessionNo"
     * @const
     */
    "AccessionNo": "AccessionNo",
    /**
     * value: "ResourceNo"
     * @const
     */
    "ResourceNo": "ResourceNo",
    /**
     * value: "LetterFormatNo"
     * @const
     */
    "LetterFormatNo": "LetterFormatNo",
    /**
     * value: "BankRefNo"
     * @const
     */
    "BankRefNo": "BankRefNo",
    /**
     * value: "LeavePassNo"
     * @const
     */
    "LeavePassNo": "LeavePassNo",
    /**
     * value: "AdmissionStep"
     * @const
     */
    "AdmissionStep": "AdmissionStep",
    /**
     * value: "ChallanNo"
     * @const
     */
    "ChallanNo": "ChallanNo",
    /**
     * value: "ItemNo"
     * @const
     */
    "ItemNo": "ItemNo",
    /**
     * value: "PurchaseOrderNo"
     * @const
     */
    "PurchaseOrderNo": "PurchaseOrderNo",
    /**
     * value: "InventoryReceiptsNo"
     * @const
     */
    "InventoryReceiptsNo": "InventoryReceiptsNo",
    /**
     * value: "LibMembershipNo"
     * @const
     */
    "LibMembershipNo": "LibMembershipNo",
    /**
     * value: "employeeId"
     * @const
     */
    "employeeId": "employeeId",
    /**
     * value: "EnquiryNo"
     * @const
     */
    "EnquiryNo": "EnquiryNo",
    /**
     * value: "Ledger_Code"
     * @const
     */
    "Ledger_Code": "Ledger_Code",
    /**
     * value: "Group_Code"
     * @const
     */
    "Group_Code": "Group_Code",
    /**
     * value: "AdmissionOnlineFeePayment"
     * @const
     */
    "AdmissionOnlineFeePayment": "AdmissionOnlineFeePayment"  };

  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],10:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AutoNumbering'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AutoNumbering'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.AutoNumberingAddRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.AutoNumbering);
  }
}(this, function(ApiClient, AutoNumbering) {
  'use strict';




  /**
   * The AutoNumberingAddRequest model module.
   * @module model/AutoNumberingAddRequest
   * @version v1
   */

  /**
   * Constructs a new <code>AutoNumberingAddRequest</code>.
   * @alias module:model/AutoNumberingAddRequest
   * @class
   */
  var exports = function() {
    var _this = this;












  };

  /**
   * Constructs a <code>AutoNumberingAddRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoNumberingAddRequest} obj Optional instance to populate.
   * @return {module:model/AutoNumberingAddRequest} The populated <code>AutoNumberingAddRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('subType')) {
        obj['subType'] = ApiClient.convertToType(data['subType'], 'Integer');
      }
      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
      if (data.hasOwnProperty('fixedValue')) {
        obj['fixedValue'] = ApiClient.convertToType(data['fixedValue'], 'String');
      }
      if (data.hasOwnProperty('variableStart')) {
        obj['variableStart'] = ApiClient.convertToType(data['variableStart'], 'Integer');
      }
      if (data.hasOwnProperty('lastRunVariable')) {
        obj['lastRunVariable'] = ApiClient.convertToType(data['lastRunVariable'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('itemGroup')) {
        obj['itemGroup'] = ApiClient.convertToType(data['itemGroup'], 'String');
      }
      if (data.hasOwnProperty('academicSession')) {
        obj['academicSession'] = ApiClient.convertToType(data['academicSession'], 'String');
      }
      if (data.hasOwnProperty('parentAutoNumberingId')) {
        obj['parentAutoNumberingId'] = AutoNumbering.constructFromObject(data['parentAutoNumberingId']);
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {Integer} subType
   */
  exports.prototype['subType'] = undefined;
  /**
   * @member {module:model/AutoNumberingAddRequest.TypeEnum} type
   */
  exports.prototype['type'] = undefined;
  /**
   * @member {String} fixedValue
   */
  exports.prototype['fixedValue'] = undefined;
  /**
   * @member {Integer} variableStart
   */
  exports.prototype['variableStart'] = undefined;
  /**
   * @member {String} lastRunVariable
   */
  exports.prototype['lastRunVariable'] = undefined;
  /**
   * @member {module:model/AutoNumberingAddRequest.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} itemGroup
   */
  exports.prototype['itemGroup'] = undefined;
  /**
   * @member {String} academicSession
   */
  exports.prototype['academicSession'] = undefined;
  /**
   * @member {module:model/AutoNumbering} parentAutoNumberingId
   */
  exports.prototype['parentAutoNumberingId'] = undefined;


  /**
   * Allowed values for the <code>type</code> property.
   * @enum {String}
   * @readonly
   */
  exports.TypeEnum = {
    /**
     * value: "VoucherNo"
     * @const
     */
    "VoucherNo": "VoucherNo",
    /**
     * value: "AdmissionRegistrationNo"
     * @const
     */
    "AdmissionRegistrationNo": "AdmissionRegistrationNo",
    /**
     * value: "ReceiptNo"
     * @const
     */
    "ReceiptNo": "ReceiptNo",
    /**
     * value: "AccessionNo"
     * @const
     */
    "AccessionNo": "AccessionNo",
    /**
     * value: "ResourceNo"
     * @const
     */
    "ResourceNo": "ResourceNo",
    /**
     * value: "LetterFormatNo"
     * @const
     */
    "LetterFormatNo": "LetterFormatNo",
    /**
     * value: "BankRefNo"
     * @const
     */
    "BankRefNo": "BankRefNo",
    /**
     * value: "LeavePassNo"
     * @const
     */
    "LeavePassNo": "LeavePassNo",
    /**
     * value: "AdmissionStep"
     * @const
     */
    "AdmissionStep": "AdmissionStep",
    /**
     * value: "ChallanNo"
     * @const
     */
    "ChallanNo": "ChallanNo",
    /**
     * value: "ItemNo"
     * @const
     */
    "ItemNo": "ItemNo",
    /**
     * value: "PurchaseOrderNo"
     * @const
     */
    "PurchaseOrderNo": "PurchaseOrderNo",
    /**
     * value: "InventoryReceiptsNo"
     * @const
     */
    "InventoryReceiptsNo": "InventoryReceiptsNo",
    /**
     * value: "LibMembershipNo"
     * @const
     */
    "LibMembershipNo": "LibMembershipNo",
    /**
     * value: "employeeId"
     * @const
     */
    "employeeId": "employeeId",
    /**
     * value: "EnquiryNo"
     * @const
     */
    "EnquiryNo": "EnquiryNo",
    /**
     * value: "Ledger_Code"
     * @const
     */
    "Ledger_Code": "Ledger_Code",
    /**
     * value: "Group_Code"
     * @const
     */
    "Group_Code": "Group_Code",
    /**
     * value: "AdmissionOnlineFeePayment"
     * @const
     */
    "AdmissionOnlineFeePayment": "AdmissionOnlineFeePayment"  };

  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6,"./AutoNumbering":9}],11:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.AutoNumberingGenerateRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The AutoNumberingGenerateRequest model module.
   * @module model/AutoNumberingGenerateRequest
   * @version v1
   */

  /**
   * Constructs a new <code>AutoNumberingGenerateRequest</code>.
   * @alias module:model/AutoNumberingGenerateRequest
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>AutoNumberingGenerateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoNumberingGenerateRequest} obj Optional instance to populate.
   * @return {module:model/AutoNumberingGenerateRequest} The populated <code>AutoNumberingGenerateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('subType')) {
        obj['subType'] = ApiClient.convertToType(data['subType'], 'Integer');
      }
      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {Integer} subType
   */
  exports.prototype['subType'] = undefined;
  /**
   * @member {module:model/AutoNumberingGenerateRequest.TypeEnum} type
   */
  exports.prototype['type'] = undefined;


  /**
   * Allowed values for the <code>type</code> property.
   * @enum {String}
   * @readonly
   */
  exports.TypeEnum = {
    /**
     * value: "VoucherNo"
     * @const
     */
    "VoucherNo": "VoucherNo",
    /**
     * value: "AdmissionRegistrationNo"
     * @const
     */
    "AdmissionRegistrationNo": "AdmissionRegistrationNo",
    /**
     * value: "ReceiptNo"
     * @const
     */
    "ReceiptNo": "ReceiptNo",
    /**
     * value: "AccessionNo"
     * @const
     */
    "AccessionNo": "AccessionNo",
    /**
     * value: "ResourceNo"
     * @const
     */
    "ResourceNo": "ResourceNo",
    /**
     * value: "LetterFormatNo"
     * @const
     */
    "LetterFormatNo": "LetterFormatNo",
    /**
     * value: "BankRefNo"
     * @const
     */
    "BankRefNo": "BankRefNo",
    /**
     * value: "LeavePassNo"
     * @const
     */
    "LeavePassNo": "LeavePassNo",
    /**
     * value: "AdmissionStep"
     * @const
     */
    "AdmissionStep": "AdmissionStep",
    /**
     * value: "ChallanNo"
     * @const
     */
    "ChallanNo": "ChallanNo",
    /**
     * value: "ItemNo"
     * @const
     */
    "ItemNo": "ItemNo",
    /**
     * value: "PurchaseOrderNo"
     * @const
     */
    "PurchaseOrderNo": "PurchaseOrderNo",
    /**
     * value: "InventoryReceiptsNo"
     * @const
     */
    "InventoryReceiptsNo": "InventoryReceiptsNo",
    /**
     * value: "LibMembershipNo"
     * @const
     */
    "LibMembershipNo": "LibMembershipNo",
    /**
     * value: "employeeId"
     * @const
     */
    "employeeId": "employeeId",
    /**
     * value: "EnquiryNo"
     * @const
     */
    "EnquiryNo": "EnquiryNo",
    /**
     * value: "Ledger_Code"
     * @const
     */
    "Ledger_Code": "Ledger_Code",
    /**
     * value: "Group_Code"
     * @const
     */
    "Group_Code": "Group_Code",
    /**
     * value: "AdmissionOnlineFeePayment"
     * @const
     */
    "AdmissionOnlineFeePayment": "AdmissionOnlineFeePayment"  };


  return exports;
}));



},{"../ApiClient":6}],12:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/AutoNumbering'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./AutoNumbering'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.AutoNumberingResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.AutoNumbering);
  }
}(this, function(ApiClient, AutoNumbering) {
  'use strict';




  /**
   * The AutoNumberingResponse model module.
   * @module model/AutoNumberingResponse
   * @version v1
   */

  /**
   * Constructs a new <code>AutoNumberingResponse</code>.
   * @alias module:model/AutoNumberingResponse
   * @class
   */
  var exports = function() {
    var _this = this;













  };

  /**
   * Constructs a <code>AutoNumberingResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoNumberingResponse} obj Optional instance to populate.
   * @return {module:model/AutoNumberingResponse} The populated <code>AutoNumberingResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('subType')) {
        obj['subType'] = ApiClient.convertToType(data['subType'], 'Integer');
      }
      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
      if (data.hasOwnProperty('fixedValue')) {
        obj['fixedValue'] = ApiClient.convertToType(data['fixedValue'], 'String');
      }
      if (data.hasOwnProperty('variableStart')) {
        obj['variableStart'] = ApiClient.convertToType(data['variableStart'], 'Integer');
      }
      if (data.hasOwnProperty('lastRunVariable')) {
        obj['lastRunVariable'] = ApiClient.convertToType(data['lastRunVariable'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('itemGroup')) {
        obj['itemGroup'] = ApiClient.convertToType(data['itemGroup'], 'String');
      }
      if (data.hasOwnProperty('academicSession')) {
        obj['academicSession'] = ApiClient.convertToType(data['academicSession'], 'String');
      }
      if (data.hasOwnProperty('parentAutoNumberingId')) {
        obj['parentAutoNumberingId'] = AutoNumbering.constructFromObject(data['parentAutoNumberingId']);
      }
    }
    return obj;
  }

  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {Integer} subType
   */
  exports.prototype['subType'] = undefined;
  /**
   * @member {module:model/AutoNumberingResponse.TypeEnum} type
   */
  exports.prototype['type'] = undefined;
  /**
   * @member {String} fixedValue
   */
  exports.prototype['fixedValue'] = undefined;
  /**
   * @member {Integer} variableStart
   */
  exports.prototype['variableStart'] = undefined;
  /**
   * @member {String} lastRunVariable
   */
  exports.prototype['lastRunVariable'] = undefined;
  /**
   * @member {module:model/AutoNumberingResponse.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} itemGroup
   */
  exports.prototype['itemGroup'] = undefined;
  /**
   * @member {String} academicSession
   */
  exports.prototype['academicSession'] = undefined;
  /**
   * @member {module:model/AutoNumbering} parentAutoNumberingId
   */
  exports.prototype['parentAutoNumberingId'] = undefined;


  /**
   * Allowed values for the <code>type</code> property.
   * @enum {String}
   * @readonly
   */
  exports.TypeEnum = {
    /**
     * value: "VoucherNo"
     * @const
     */
    "VoucherNo": "VoucherNo",
    /**
     * value: "AdmissionRegistrationNo"
     * @const
     */
    "AdmissionRegistrationNo": "AdmissionRegistrationNo",
    /**
     * value: "ReceiptNo"
     * @const
     */
    "ReceiptNo": "ReceiptNo",
    /**
     * value: "AccessionNo"
     * @const
     */
    "AccessionNo": "AccessionNo",
    /**
     * value: "ResourceNo"
     * @const
     */
    "ResourceNo": "ResourceNo",
    /**
     * value: "LetterFormatNo"
     * @const
     */
    "LetterFormatNo": "LetterFormatNo",
    /**
     * value: "BankRefNo"
     * @const
     */
    "BankRefNo": "BankRefNo",
    /**
     * value: "LeavePassNo"
     * @const
     */
    "LeavePassNo": "LeavePassNo",
    /**
     * value: "AdmissionStep"
     * @const
     */
    "AdmissionStep": "AdmissionStep",
    /**
     * value: "ChallanNo"
     * @const
     */
    "ChallanNo": "ChallanNo",
    /**
     * value: "ItemNo"
     * @const
     */
    "ItemNo": "ItemNo",
    /**
     * value: "PurchaseOrderNo"
     * @const
     */
    "PurchaseOrderNo": "PurchaseOrderNo",
    /**
     * value: "InventoryReceiptsNo"
     * @const
     */
    "InventoryReceiptsNo": "InventoryReceiptsNo",
    /**
     * value: "LibMembershipNo"
     * @const
     */
    "LibMembershipNo": "LibMembershipNo",
    /**
     * value: "employeeId"
     * @const
     */
    "employeeId": "employeeId",
    /**
     * value: "EnquiryNo"
     * @const
     */
    "EnquiryNo": "EnquiryNo",
    /**
     * value: "Ledger_Code"
     * @const
     */
    "Ledger_Code": "Ledger_Code",
    /**
     * value: "Group_Code"
     * @const
     */
    "Group_Code": "Group_Code",
    /**
     * value: "AdmissionOnlineFeePayment"
     * @const
     */
    "AdmissionOnlineFeePayment": "AdmissionOnlineFeePayment"  };

  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6,"./AutoNumbering":9}],13:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.AutoNumberingUpdateRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The AutoNumberingUpdateRequest model module.
   * @module model/AutoNumberingUpdateRequest
   * @version v1
   */

  /**
   * Constructs a new <code>AutoNumberingUpdateRequest</code>.
   * @alias module:model/AutoNumberingUpdateRequest
   * @class
   */
  var exports = function() {
    var _this = this;








  };

  /**
   * Constructs a <code>AutoNumberingUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/AutoNumberingUpdateRequest} obj Optional instance to populate.
   * @return {module:model/AutoNumberingUpdateRequest} The populated <code>AutoNumberingUpdateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('subType')) {
        obj['subType'] = ApiClient.convertToType(data['subType'], 'Integer');
      }
      if (data.hasOwnProperty('type')) {
        obj['type'] = ApiClient.convertToType(data['type'], 'String');
      }
      if (data.hasOwnProperty('fixedValue')) {
        obj['fixedValue'] = ApiClient.convertToType(data['fixedValue'], 'String');
      }
      if (data.hasOwnProperty('variableStart')) {
        obj['variableStart'] = ApiClient.convertToType(data['variableStart'], 'Integer');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {Integer} subType
   */
  exports.prototype['subType'] = undefined;
  /**
   * @member {module:model/AutoNumberingUpdateRequest.TypeEnum} type
   */
  exports.prototype['type'] = undefined;
  /**
   * @member {String} fixedValue
   */
  exports.prototype['fixedValue'] = undefined;
  /**
   * @member {Integer} variableStart
   */
  exports.prototype['variableStart'] = undefined;
  /**
   * @member {module:model/AutoNumberingUpdateRequest.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;


  /**
   * Allowed values for the <code>type</code> property.
   * @enum {String}
   * @readonly
   */
  exports.TypeEnum = {
    /**
     * value: "VoucherNo"
     * @const
     */
    "VoucherNo": "VoucherNo",
    /**
     * value: "AdmissionRegistrationNo"
     * @const
     */
    "AdmissionRegistrationNo": "AdmissionRegistrationNo",
    /**
     * value: "ReceiptNo"
     * @const
     */
    "ReceiptNo": "ReceiptNo",
    /**
     * value: "AccessionNo"
     * @const
     */
    "AccessionNo": "AccessionNo",
    /**
     * value: "ResourceNo"
     * @const
     */
    "ResourceNo": "ResourceNo",
    /**
     * value: "LetterFormatNo"
     * @const
     */
    "LetterFormatNo": "LetterFormatNo",
    /**
     * value: "BankRefNo"
     * @const
     */
    "BankRefNo": "BankRefNo",
    /**
     * value: "LeavePassNo"
     * @const
     */
    "LeavePassNo": "LeavePassNo",
    /**
     * value: "AdmissionStep"
     * @const
     */
    "AdmissionStep": "AdmissionStep",
    /**
     * value: "ChallanNo"
     * @const
     */
    "ChallanNo": "ChallanNo",
    /**
     * value: "ItemNo"
     * @const
     */
    "ItemNo": "ItemNo",
    /**
     * value: "PurchaseOrderNo"
     * @const
     */
    "PurchaseOrderNo": "PurchaseOrderNo",
    /**
     * value: "InventoryReceiptsNo"
     * @const
     */
    "InventoryReceiptsNo": "InventoryReceiptsNo",
    /**
     * value: "LibMembershipNo"
     * @const
     */
    "LibMembershipNo": "LibMembershipNo",
    /**
     * value: "employeeId"
     * @const
     */
    "employeeId": "employeeId",
    /**
     * value: "EnquiryNo"
     * @const
     */
    "EnquiryNo": "EnquiryNo",
    /**
     * value: "Ledger_Code"
     * @const
     */
    "Ledger_Code": "Ledger_Code",
    /**
     * value: "Group_Code"
     * @const
     */
    "Group_Code": "Group_Code",
    /**
     * value: "AdmissionOnlineFeePayment"
     * @const
     */
    "AdmissionOnlineFeePayment": "AdmissionOnlineFeePayment"  };

  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],14:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Entities'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Entities'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomField = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.Entities);
  }
}(this, function(ApiClient, Entities) {
  'use strict';




  /**
   * The CustomField model module.
   * @module model/CustomField
   * @version v1
   */

  /**
   * Constructs a new <code>CustomField</code>.
   * @alias module:model/CustomField
   * @class
   */
  var exports = function() {
    var _this = this;














  };

  /**
   * Constructs a <code>CustomField</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomField} obj Optional instance to populate.
   * @return {module:model/CustomField} The populated <code>CustomField</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Integer');
      }
      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('fieldName')) {
        obj['fieldName'] = ApiClient.convertToType(data['fieldName'], 'String');
      }
      if (data.hasOwnProperty('entityId')) {
        obj['entityId'] = Entities.constructFromObject(data['entityId']);
      }
      if (data.hasOwnProperty('fieldTypeId')) {
        obj['fieldTypeId'] = ApiClient.convertToType(data['fieldTypeId'], 'Integer');
      }
      if (data.hasOwnProperty('dataTypeId')) {
        obj['dataTypeId'] = ApiClient.convertToType(data['dataTypeId'], 'String');
      }
      if (data.hasOwnProperty('ifMandatory')) {
        obj['ifMandatory'] = ApiClient.convertToType(data['ifMandatory'], 'Boolean');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {Integer} id
   */
  exports.prototype['id'] = undefined;
  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} fieldName
   */
  exports.prototype['fieldName'] = undefined;
  /**
   * @member {module:model/Entities} entityId
   */
  exports.prototype['entityId'] = undefined;
  /**
   * @member {Integer} fieldTypeId
   */
  exports.prototype['fieldTypeId'] = undefined;
  /**
   * @member {String} dataTypeId
   */
  exports.prototype['dataTypeId'] = undefined;
  /**
   * @member {Boolean} ifMandatory
   * @default false
   */
  exports.prototype['ifMandatory'] = false;
  /**
   * @member {module:model/CustomField.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6,"./Entities":25}],15:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldAddRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CustomFieldAddRequest model module.
   * @module model/CustomFieldAddRequest
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldAddRequest</code>.
   * @alias module:model/CustomFieldAddRequest
   * @class
   */
  var exports = function() {
    var _this = this;










  };

  /**
   * Constructs a <code>CustomFieldAddRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldAddRequest} obj Optional instance to populate.
   * @return {module:model/CustomFieldAddRequest} The populated <code>CustomFieldAddRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('fieldName')) {
        obj['fieldName'] = ApiClient.convertToType(data['fieldName'], 'String');
      }
      if (data.hasOwnProperty('entityLong')) {
        obj['entityLong'] = ApiClient.convertToType(data['entityLong'], 'String');
      }
      if (data.hasOwnProperty('fieldTypeId')) {
        obj['fieldTypeId'] = ApiClient.convertToType(data['fieldTypeId'], 'Integer');
      }
      if (data.hasOwnProperty('dataTypeId')) {
        obj['dataTypeId'] = ApiClient.convertToType(data['dataTypeId'], 'String');
      }
      if (data.hasOwnProperty('ifMandatory')) {
        obj['ifMandatory'] = ApiClient.convertToType(data['ifMandatory'], 'Boolean');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {String} fieldName
   */
  exports.prototype['fieldName'] = undefined;
  /**
   * @member {String} entityLong
   */
  exports.prototype['entityLong'] = undefined;
  /**
   * @member {Integer} fieldTypeId
   */
  exports.prototype['fieldTypeId'] = undefined;
  /**
   * @member {String} dataTypeId
   */
  exports.prototype['dataTypeId'] = undefined;
  /**
   * @member {Boolean} ifMandatory
   * @default false
   */
  exports.prototype['ifMandatory'] = false;
  /**
   * @member {module:model/CustomFieldAddRequest.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],16:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldDataAddRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CustomFieldDataAddRequest model module.
   * @module model/CustomFieldDataAddRequest
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldDataAddRequest</code>.
   * @alias module:model/CustomFieldDataAddRequest
   * @class
   */
  var exports = function() {
    var _this = this;






  };

  /**
   * Constructs a <code>CustomFieldDataAddRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldDataAddRequest} obj Optional instance to populate.
   * @return {module:model/CustomFieldDataAddRequest} The populated <code>CustomFieldDataAddRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('customFieldLong')) {
        obj['customFieldLong'] = ApiClient.convertToType(data['customFieldLong'], 'String');
      }
      if (data.hasOwnProperty('entityInstanceLong')) {
        obj['entityInstanceLong'] = ApiClient.convertToType(data['entityInstanceLong'], 'String');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} customFieldLong
   */
  exports.prototype['customFieldLong'] = undefined;
  /**
   * @member {String} entityInstanceLong
   */
  exports.prototype['entityInstanceLong'] = undefined;
  /**
   * @member {String} value
   */
  exports.prototype['value'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;



  return exports;
}));



},{"../ApiClient":6}],17:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CustomField'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CustomField'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldDataResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.CustomField);
  }
}(this, function(ApiClient, CustomField) {
  'use strict';




  /**
   * The CustomFieldDataResponse model module.
   * @module model/CustomFieldDataResponse
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldDataResponse</code>.
   * @alias module:model/CustomFieldDataResponse
   * @class
   */
  var exports = function() {
    var _this = this;









  };

  /**
   * Constructs a <code>CustomFieldDataResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldDataResponse} obj Optional instance to populate.
   * @return {module:model/CustomFieldDataResponse} The populated <code>CustomFieldDataResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('customField')) {
        obj['customField'] = CustomField.constructFromObject(data['customField']);
      }
      if (data.hasOwnProperty('entityInstanceLong')) {
        obj['entityInstanceLong'] = ApiClient.convertToType(data['entityInstanceLong'], 'String');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {module:model/CustomField} customField
   */
  exports.prototype['customField'] = undefined;
  /**
   * @member {String} entityInstanceLong
   */
  exports.prototype['entityInstanceLong'] = undefined;
  /**
   * @member {String} value
   */
  exports.prototype['value'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;



  return exports;
}));



},{"../ApiClient":6,"./CustomField":14}],18:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldDataUpdateRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CustomFieldDataUpdateRequest model module.
   * @module model/CustomFieldDataUpdateRequest
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldDataUpdateRequest</code>.
   * @alias module:model/CustomFieldDataUpdateRequest
   * @class
   */
  var exports = function() {
    var _this = this;




  };

  /**
   * Constructs a <code>CustomFieldDataUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldDataUpdateRequest} obj Optional instance to populate.
   * @return {module:model/CustomFieldDataUpdateRequest} The populated <code>CustomFieldDataUpdateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} value
   */
  exports.prototype['value'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;



  return exports;
}));



},{"../ApiClient":6}],19:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldListAddRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CustomFieldListAddRequest model module.
   * @module model/CustomFieldListAddRequest
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldListAddRequest</code>.
   * @alias module:model/CustomFieldListAddRequest
   * @class
   */
  var exports = function() {
    var _this = this;






  };

  /**
   * Constructs a <code>CustomFieldListAddRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldListAddRequest} obj Optional instance to populate.
   * @return {module:model/CustomFieldListAddRequest} The populated <code>CustomFieldListAddRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('customFieldLong')) {
        obj['customFieldLong'] = ApiClient.convertToType(data['customFieldLong'], 'String');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} customFieldLong
   */
  exports.prototype['customFieldLong'] = undefined;
  /**
   * @member {String} value
   */
  exports.prototype['value'] = undefined;
  /**
   * @member {module:model/CustomFieldListAddRequest.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],20:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CustomField'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CustomField'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldListResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.CustomField);
  }
}(this, function(ApiClient, CustomField) {
  'use strict';




  /**
   * The CustomFieldListResponse model module.
   * @module model/CustomFieldListResponse
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldListResponse</code>.
   * @alias module:model/CustomFieldListResponse
   * @class
   */
  var exports = function() {
    var _this = this;









  };

  /**
   * Constructs a <code>CustomFieldListResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldListResponse} obj Optional instance to populate.
   * @return {module:model/CustomFieldListResponse} The populated <code>CustomFieldListResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('customField')) {
        obj['customField'] = CustomField.constructFromObject(data['customField']);
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('value')) {
        obj['value'] = ApiClient.convertToType(data['value'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {module:model/CustomField} customField
   */
  exports.prototype['customField'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} value
   */
  exports.prototype['value'] = undefined;
  /**
   * @member {module:model/CustomFieldListResponse.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6,"./CustomField":14}],21:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldMappingAddRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CustomFieldMappingAddRequest model module.
   * @module model/CustomFieldMappingAddRequest
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldMappingAddRequest</code>.
   * @alias module:model/CustomFieldMappingAddRequest
   * @class
   */
  var exports = function() {
    var _this = this;







  };

  /**
   * Constructs a <code>CustomFieldMappingAddRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldMappingAddRequest} obj Optional instance to populate.
   * @return {module:model/CustomFieldMappingAddRequest} The populated <code>CustomFieldMappingAddRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('customFieldLong')) {
        obj['customFieldLong'] = ApiClient.convertToType(data['customFieldLong'], 'String');
      }
      if (data.hasOwnProperty('masterTemplateLong')) {
        obj['masterTemplateLong'] = ApiClient.convertToType(data['masterTemplateLong'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {String} customFieldLong
   */
  exports.prototype['customFieldLong'] = undefined;
  /**
   * @member {String} masterTemplateLong
   */
  exports.prototype['masterTemplateLong'] = undefined;
  /**
   * @member {module:model/CustomFieldMappingAddRequest.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],22:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/CustomField', 'model/MasterTemplate'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./CustomField'), require('./MasterTemplate'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldMappingResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.CustomField, root.SpringBootJerseySwaggerDockerExample.MasterTemplate);
  }
}(this, function(ApiClient, CustomField, MasterTemplate) {
  'use strict';




  /**
   * The CustomFieldMappingResponse model module.
   * @module model/CustomFieldMappingResponse
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldMappingResponse</code>.
   * @alias module:model/CustomFieldMappingResponse
   * @class
   */
  var exports = function() {
    var _this = this;










  };

  /**
   * Constructs a <code>CustomFieldMappingResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldMappingResponse} obj Optional instance to populate.
   * @return {module:model/CustomFieldMappingResponse} The populated <code>CustomFieldMappingResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('customField')) {
        obj['customField'] = CustomField.constructFromObject(data['customField']);
      }
      if (data.hasOwnProperty('masterTemplate')) {
        obj['masterTemplate'] = MasterTemplate.constructFromObject(data['masterTemplate']);
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {module:model/CustomField} customField
   */
  exports.prototype['customField'] = undefined;
  /**
   * @member {module:model/MasterTemplate} masterTemplate
   */
  exports.prototype['masterTemplate'] = undefined;
  /**
   * @member {module:model/CustomFieldMappingResponse.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6,"./CustomField":14,"./MasterTemplate":28}],23:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient', 'model/Entities'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'), require('./Entities'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient, root.SpringBootJerseySwaggerDockerExample.Entities);
  }
}(this, function(ApiClient, Entities) {
  'use strict';




  /**
   * The CustomFieldResponse model module.
   * @module model/CustomFieldResponse
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldResponse</code>.
   * @alias module:model/CustomFieldResponse
   * @class
   */
  var exports = function() {
    var _this = this;













  };

  /**
   * Constructs a <code>CustomFieldResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldResponse} obj Optional instance to populate.
   * @return {module:model/CustomFieldResponse} The populated <code>CustomFieldResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('fieldName')) {
        obj['fieldName'] = ApiClient.convertToType(data['fieldName'], 'String');
      }
      if (data.hasOwnProperty('entityId')) {
        obj['entityId'] = Entities.constructFromObject(data['entityId']);
      }
      if (data.hasOwnProperty('fieldTypeId')) {
        obj['fieldTypeId'] = ApiClient.convertToType(data['fieldTypeId'], 'Integer');
      }
      if (data.hasOwnProperty('dataTypeId')) {
        obj['dataTypeId'] = ApiClient.convertToType(data['dataTypeId'], 'String');
      }
      if (data.hasOwnProperty('ifMandatory')) {
        obj['ifMandatory'] = ApiClient.convertToType(data['ifMandatory'], 'Boolean');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} fieldName
   */
  exports.prototype['fieldName'] = undefined;
  /**
   * @member {module:model/Entities} entityId
   */
  exports.prototype['entityId'] = undefined;
  /**
   * @member {Integer} fieldTypeId
   */
  exports.prototype['fieldTypeId'] = undefined;
  /**
   * @member {String} dataTypeId
   */
  exports.prototype['dataTypeId'] = undefined;
  /**
   * @member {Boolean} ifMandatory
   * @default false
   */
  exports.prototype['ifMandatory'] = false;
  /**
   * @member {module:model/CustomFieldResponse.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6,"./Entities":25}],24:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.CustomFieldUpdateRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The CustomFieldUpdateRequest model module.
   * @module model/CustomFieldUpdateRequest
   * @version v1
   */

  /**
   * Constructs a new <code>CustomFieldUpdateRequest</code>.
   * @alias module:model/CustomFieldUpdateRequest
   * @class
   */
  var exports = function() {
    var _this = this;






  };

  /**
   * Constructs a <code>CustomFieldUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/CustomFieldUpdateRequest} obj Optional instance to populate.
   * @return {module:model/CustomFieldUpdateRequest} The populated <code>CustomFieldUpdateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('fieldName')) {
        obj['fieldName'] = ApiClient.convertToType(data['fieldName'], 'String');
      }
      if (data.hasOwnProperty('ifMandatory')) {
        obj['ifMandatory'] = ApiClient.convertToType(data['ifMandatory'], 'Boolean');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} fieldName
   */
  exports.prototype['fieldName'] = undefined;
  /**
   * @member {Boolean} ifMandatory
   * @default false
   */
  exports.prototype['ifMandatory'] = false;
  /**
   * @member {module:model/CustomFieldUpdateRequest.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],25:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.Entities = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The Entities model module.
   * @module model/Entities
   * @version v1
   */

  /**
   * Constructs a new <code>Entities</code>.
   * @alias module:model/Entities
   * @class
   */
  var exports = function() {
    var _this = this;









  };

  /**
   * Constructs a <code>Entities</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/Entities} obj Optional instance to populate.
   * @return {module:model/Entities} The populated <code>Entities</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Integer');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('entityName')) {
        obj['entityName'] = ApiClient.convertToType(data['entityName'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {Integer} id
   */
  exports.prototype['id'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} entityName
   */
  exports.prototype['entityName'] = undefined;
  /**
   * @member {module:model/Entities.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],26:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.EntityResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The EntityResponse model module.
   * @module model/EntityResponse
   * @version v1
   */

  /**
   * Constructs a new <code>EntityResponse</code>.
   * @alias module:model/EntityResponse
   * @class
   */
  var exports = function() {
    var _this = this;








  };

  /**
   * Constructs a <code>EntityResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/EntityResponse} obj Optional instance to populate.
   * @return {module:model/EntityResponse} The populated <code>EntityResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('entityName')) {
        obj['entityName'] = ApiClient.convertToType(data['entityName'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} entityName
   */
  exports.prototype['entityName'] = undefined;
  /**
   * @member {module:model/EntityResponse.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],27:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.JerseyResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The JerseyResponse model module.
   * @module model/JerseyResponse
   * @version v1
   */

  /**
   * Constructs a new <code>JerseyResponse</code>.
   * @alias module:model/JerseyResponse
   * @class
   */
  var exports = function() {
    var _this = this;



  };

  /**
   * Constructs a <code>JerseyResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/JerseyResponse} obj Optional instance to populate.
   * @return {module:model/JerseyResponse} The populated <code>JerseyResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('code')) {
        obj['code'] = ApiClient.convertToType(data['code'], 'String');
      }
      if (data.hasOwnProperty('msg')) {
        obj['msg'] = ApiClient.convertToType(data['msg'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} code
   */
  exports.prototype['code'] = undefined;
  /**
   * @member {String} msg
   */
  exports.prototype['msg'] = undefined;



  return exports;
}));



},{"../ApiClient":6}],28:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.MasterTemplate = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MasterTemplate model module.
   * @module model/MasterTemplate
   * @version v1
   */

  /**
   * Constructs a new <code>MasterTemplate</code>.
   * @alias module:model/MasterTemplate
   * @class
   */
  var exports = function() {
    var _this = this;











  };

  /**
   * Constructs a <code>MasterTemplate</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MasterTemplate} obj Optional instance to populate.
   * @return {module:model/MasterTemplate} The populated <code>MasterTemplate</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('id')) {
        obj['id'] = ApiClient.convertToType(data['id'], 'Integer');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('erpUrlLong')) {
        obj['erpUrlLong'] = ApiClient.convertToType(data['erpUrlLong'], 'String');
      }
      if (data.hasOwnProperty('entityLong')) {
        obj['entityLong'] = ApiClient.convertToType(data['entityLong'], 'String');
      }
      if (data.hasOwnProperty('masterTemplateName')) {
        obj['masterTemplateName'] = ApiClient.convertToType(data['masterTemplateName'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {Integer} id
   */
  exports.prototype['id'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} erpUrlLong
   */
  exports.prototype['erpUrlLong'] = undefined;
  /**
   * @member {String} entityLong
   */
  exports.prototype['entityLong'] = undefined;
  /**
   * @member {String} masterTemplateName
   */
  exports.prototype['masterTemplateName'] = undefined;
  /**
   * @member {module:model/MasterTemplate.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],29:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.MasterTemplateResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The MasterTemplateResponse model module.
   * @module model/MasterTemplateResponse
   * @version v1
   */

  /**
   * Constructs a new <code>MasterTemplateResponse</code>.
   * @alias module:model/MasterTemplateResponse
   * @class
   */
  var exports = function() {
    var _this = this;










  };

  /**
   * Constructs a <code>MasterTemplateResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/MasterTemplateResponse} obj Optional instance to populate.
   * @return {module:model/MasterTemplateResponse} The populated <code>MasterTemplateResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
      if (data.hasOwnProperty('erpUrlLong')) {
        obj['erpUrlLong'] = ApiClient.convertToType(data['erpUrlLong'], 'String');
      }
      if (data.hasOwnProperty('entityLong')) {
        obj['entityLong'] = ApiClient.convertToType(data['entityLong'], 'String');
      }
      if (data.hasOwnProperty('masterTemplateName')) {
        obj['masterTemplateName'] = ApiClient.convertToType(data['masterTemplateName'], 'String');
      }
      if (data.hasOwnProperty('status')) {
        obj['status'] = ApiClient.convertToType(data['status'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
    }
    return obj;
  }

  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;
  /**
   * @member {String} erpUrlLong
   */
  exports.prototype['erpUrlLong'] = undefined;
  /**
   * @member {String} entityLong
   */
  exports.prototype['entityLong'] = undefined;
  /**
   * @member {String} masterTemplateName
   */
  exports.prototype['masterTemplateName'] = undefined;
  /**
   * @member {module:model/MasterTemplateResponse.StatusEnum} status
   */
  exports.prototype['status'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;


  /**
   * Allowed values for the <code>status</code> property.
   * @enum {String}
   * @readonly
   */
  exports.StatusEnum = {
    /**
     * value: "Active"
     * @const
     */
    "Active": "Active",
    /**
     * value: "Inactive"
     * @const
     */
    "Inactive": "Inactive"  };


  return exports;
}));



},{"../ApiClient":6}],30:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.ProductFeatureAddRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ProductFeatureAddRequest model module.
   * @module model/ProductFeatureAddRequest
   * @version v1
   */

  /**
   * Constructs a new <code>ProductFeatureAddRequest</code>.
   * @alias module:model/ProductFeatureAddRequest
   * @class
   */
  var exports = function() {
    var _this = this;






  };

  /**
   * Constructs a <code>ProductFeatureAddRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProductFeatureAddRequest} obj Optional instance to populate.
   * @return {module:model/ProductFeatureAddRequest} The populated <code>ProductFeatureAddRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('featureDesc')) {
        obj['featureDesc'] = ApiClient.convertToType(data['featureDesc'], 'String');
      }
      if (data.hasOwnProperty('featureValue')) {
        obj['featureValue'] = ApiClient.convertToType(data['featureValue'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {String} featureDesc
   */
  exports.prototype['featureDesc'] = undefined;
  /**
   * @member {String} featureValue
   */
  exports.prototype['featureValue'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;



  return exports;
}));



},{"../ApiClient":6}],31:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.ProductFeatureResponse = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ProductFeatureResponse model module.
   * @module model/ProductFeatureResponse
   * @version v1
   */

  /**
   * Constructs a new <code>ProductFeatureResponse</code>.
   * @alias module:model/ProductFeatureResponse
   * @class
   */
  var exports = function() {
    var _this = this;









  };

  /**
   * Constructs a <code>ProductFeatureResponse</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProductFeatureResponse} obj Optional instance to populate.
   * @return {module:model/ProductFeatureResponse} The populated <code>ProductFeatureResponse</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('featureDesc')) {
        obj['featureDesc'] = ApiClient.convertToType(data['featureDesc'], 'String');
      }
      if (data.hasOwnProperty('featureValue')) {
        obj['featureValue'] = ApiClient.convertToType(data['featureValue'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('createdOn')) {
        obj['createdOn'] = ApiClient.convertToType(data['createdOn'], 'Date');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedOn')) {
        obj['modifiedOn'] = ApiClient.convertToType(data['modifiedOn'], 'Date');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {String} featureDesc
   */
  exports.prototype['featureDesc'] = undefined;
  /**
   * @member {String} featureValue
   */
  exports.prototype['featureValue'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {Date} createdOn
   */
  exports.prototype['createdOn'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {Date} modifiedOn
   */
  exports.prototype['modifiedOn'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;



  return exports;
}));



},{"../ApiClient":6}],32:[function(require,module,exports){
/**
 * Spring Boot + Jersey + Swagger + Docker Example
 * No descripton provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['ApiClient'], factory);
  } else if (typeof module === 'object' && module.exports) {
    // CommonJS-like environments that support module.exports, like Node.
    module.exports = factory(require('../ApiClient'));
  } else {
    // Browser globals (root is window)
    if (!root.SpringBootJerseySwaggerDockerExample) {
      root.SpringBootJerseySwaggerDockerExample = {};
    }
    root.SpringBootJerseySwaggerDockerExample.ProductFeatureUpdateRequest = factory(root.SpringBootJerseySwaggerDockerExample.ApiClient);
  }
}(this, function(ApiClient) {
  'use strict';




  /**
   * The ProductFeatureUpdateRequest model module.
   * @module model/ProductFeatureUpdateRequest
   * @version v1
   */

  /**
   * Constructs a new <code>ProductFeatureUpdateRequest</code>.
   * @alias module:model/ProductFeatureUpdateRequest
   * @class
   */
  var exports = function() {
    var _this = this;







  };

  /**
   * Constructs a <code>ProductFeatureUpdateRequest</code> from a plain JavaScript object, optionally creating a new instance.
   * Copies all relevant properties from <code>data</code> to <code>obj</code> if supplied or a new instance if not.
   * @param {Object} data The plain JavaScript object bearing properties of interest.
   * @param {module:model/ProductFeatureUpdateRequest} obj Optional instance to populate.
   * @return {module:model/ProductFeatureUpdateRequest} The populated <code>ProductFeatureUpdateRequest</code> instance.
   */
  exports.constructFromObject = function(data, obj) {
    if (data) {
      obj = obj || new exports();

      if (data.hasOwnProperty('branch')) {
        obj['branch'] = ApiClient.convertToType(data['branch'], 'String');
      }
      if (data.hasOwnProperty('featureDesc')) {
        obj['featureDesc'] = ApiClient.convertToType(data['featureDesc'], 'String');
      }
      if (data.hasOwnProperty('featureValue')) {
        obj['featureValue'] = ApiClient.convertToType(data['featureValue'], 'String');
      }
      if (data.hasOwnProperty('createdBy')) {
        obj['createdBy'] = ApiClient.convertToType(data['createdBy'], 'String');
      }
      if (data.hasOwnProperty('modifiedBy')) {
        obj['modifiedBy'] = ApiClient.convertToType(data['modifiedBy'], 'String');
      }
      if (data.hasOwnProperty('Long')) {
        obj['Long'] = ApiClient.convertToType(data['Long'], 'String');
      }
    }
    return obj;
  }

  /**
   * @member {String} branch
   */
  exports.prototype['branch'] = undefined;
  /**
   * @member {String} featureDesc
   */
  exports.prototype['featureDesc'] = undefined;
  /**
   * @member {String} featureValue
   */
  exports.prototype['featureValue'] = undefined;
  /**
   * @member {String} createdBy
   */
  exports.prototype['createdBy'] = undefined;
  /**
   * @member {String} modifiedBy
   */
  exports.prototype['modifiedBy'] = undefined;
  /**
   * @member {String} Long
   */
  exports.prototype['Long'] = undefined;



  return exports;
}));



},{"../ApiClient":6}],33:[function(require,module,exports){

},{}],34:[function(require,module,exports){
'use strict'

exports.byteLength = byteLength
exports.toByteArray = toByteArray
exports.fromByteArray = fromByteArray

var lookup = []
var revLookup = []
var Arr = typeof Uint8Array !== 'undefined' ? Uint8Array : Array

var code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
for (var i = 0, len = code.length; i < len; ++i) {
  lookup[i] = code[i]
  revLookup[code.charCodeAt(i)] = i
}

revLookup['-'.charCodeAt(0)] = 62
revLookup['_'.charCodeAt(0)] = 63

function placeHoldersCount (b64) {
  var len = b64.length
  if (len % 4 > 0) {
    throw new Error('Invalid string. Length must be a multiple of 4')
  }

  // the number of equal signs (place holders)
  // if there are two placeholders, than the two characters before it
  // represent one byte
  // if there is only one, then the three characters before it represent 2 bytes
  // this is just a cheap hack to not do indexOf twice
  return b64[len - 2] === '=' ? 2 : b64[len - 1] === '=' ? 1 : 0
}

function byteLength (b64) {
  // base64 is 4/3 + up to two characters of the original data
  return b64.length * 3 / 4 - placeHoldersCount(b64)
}

function toByteArray (b64) {
  var i, j, l, tmp, placeHolders, arr
  var len = b64.length
  placeHolders = placeHoldersCount(b64)

  arr = new Arr(len * 3 / 4 - placeHolders)

  // if there are placeholders, only get up to the last complete 4 chars
  l = placeHolders > 0 ? len - 4 : len

  var L = 0

  for (i = 0, j = 0; i < l; i += 4, j += 3) {
    tmp = (revLookup[b64.charCodeAt(i)] << 18) | (revLookup[b64.charCodeAt(i + 1)] << 12) | (revLookup[b64.charCodeAt(i + 2)] << 6) | revLookup[b64.charCodeAt(i + 3)]
    arr[L++] = (tmp >> 16) & 0xFF
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  if (placeHolders === 2) {
    tmp = (revLookup[b64.charCodeAt(i)] << 2) | (revLookup[b64.charCodeAt(i + 1)] >> 4)
    arr[L++] = tmp & 0xFF
  } else if (placeHolders === 1) {
    tmp = (revLookup[b64.charCodeAt(i)] << 10) | (revLookup[b64.charCodeAt(i + 1)] << 4) | (revLookup[b64.charCodeAt(i + 2)] >> 2)
    arr[L++] = (tmp >> 8) & 0xFF
    arr[L++] = tmp & 0xFF
  }

  return arr
}

function tripletToBase64 (num) {
  return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F]
}

function encodeChunk (uint8, start, end) {
  var tmp
  var output = []
  for (var i = start; i < end; i += 3) {
    tmp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2])
    output.push(tripletToBase64(tmp))
  }
  return output.join('')
}

function fromByteArray (uint8) {
  var tmp
  var len = uint8.length
  var extraBytes = len % 3 // if we have 1 byte left, pad 2 bytes
  var output = ''
  var parts = []
  var maxChunkLength = 16383 // must be multiple of 3

  // go through the array every three bytes, we'll deal with trailing stuff later
  for (var i = 0, len2 = len - extraBytes; i < len2; i += maxChunkLength) {
    parts.push(encodeChunk(uint8, i, (i + maxChunkLength) > len2 ? len2 : (i + maxChunkLength)))
  }

  // pad the end with zeros, but make sure to not forget the extra bytes
  if (extraBytes === 1) {
    tmp = uint8[len - 1]
    output += lookup[tmp >> 2]
    output += lookup[(tmp << 4) & 0x3F]
    output += '=='
  } else if (extraBytes === 2) {
    tmp = (uint8[len - 2] << 8) + (uint8[len - 1])
    output += lookup[tmp >> 10]
    output += lookup[(tmp >> 4) & 0x3F]
    output += lookup[(tmp << 2) & 0x3F]
    output += '='
  }

  parts.push(output)

  return parts.join('')
}

},{}],35:[function(require,module,exports){
(function (global){
/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <feross@feross.org> <http://feross.org>
 * @license  MIT
 */
/* eslint-disable no-proto */

'use strict'

var base64 = require('base64-js')
var ieee754 = require('ieee754')
var isArray = require('isarray')

exports.Buffer = Buffer
exports.SlowBuffer = SlowBuffer
exports.INSPECT_MAX_BYTES = 50

/**
 * If `Buffer.TYPED_ARRAY_SUPPORT`:
 *   === true    Use Uint8Array implementation (fastest)
 *   === false   Use Object implementation (most compatible, even IE6)
 *
 * Browsers that support typed arrays are IE 10+, Firefox 4+, Chrome 7+, Safari 5.1+,
 * Opera 11.6+, iOS 4.2+.
 *
 * Due to various browser bugs, sometimes the Object implementation will be used even
 * when the browser supports typed arrays.
 *
 * Note:
 *
 *   - Firefox 4-29 lacks support for adding new properties to `Uint8Array` instances,
 *     See: https://bugzilla.mozilla.org/show_bug.cgi?id=695438.
 *
 *   - Chrome 9-10 is missing the `TypedArray.prototype.subarray` function.
 *
 *   - IE10 has a broken `TypedArray.prototype.subarray` function which returns arrays of
 *     incorrect length in some situations.

 * We detect these buggy browsers and set `Buffer.TYPED_ARRAY_SUPPORT` to `false` so they
 * get the Object implementation, which is slower but behaves correctly.
 */
Buffer.TYPED_ARRAY_SUPPORT = global.TYPED_ARRAY_SUPPORT !== undefined
  ? global.TYPED_ARRAY_SUPPORT
  : typedArraySupport()

/*
 * Export kMaxLength after typed array support is determined.
 */
exports.kMaxLength = kMaxLength()

function typedArraySupport () {
  try {
    var arr = new Uint8Array(1)
    arr.__proto__ = {__proto__: Uint8Array.prototype, foo: function () { return 42 }}
    return arr.foo() === 42 && // typed array instances can be augmented
        typeof arr.subarray === 'function' && // chrome 9-10 lack `subarray`
        arr.subarray(1, 1).byteLength === 0 // ie10 has broken `subarray`
  } catch (e) {
    return false
  }
}

function kMaxLength () {
  return Buffer.TYPED_ARRAY_SUPPORT
    ? 0x7fffffff
    : 0x3fffffff
}

function createBuffer (that, length) {
  if (kMaxLength() < length) {
    throw new RangeError('Invalid typed array length')
  }
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = new Uint8Array(length)
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    if (that === null) {
      that = new Buffer(length)
    }
    that.length = length
  }

  return that
}

/**
 * The Buffer constructor returns instances of `Uint8Array` that have their
 * prototype changed to `Buffer.prototype`. Furthermore, `Buffer` is a subclass of
 * `Uint8Array`, so the returned instances will have all the node `Buffer` methods
 * and the `Uint8Array` methods. Square bracket notation works as expected -- it
 * returns a single octet.
 *
 * The `Uint8Array` prototype remains unmodified.
 */

function Buffer (arg, encodingOrOffset, length) {
  if (!Buffer.TYPED_ARRAY_SUPPORT && !(this instanceof Buffer)) {
    return new Buffer(arg, encodingOrOffset, length)
  }

  // Common case.
  if (typeof arg === 'number') {
    if (typeof encodingOrOffset === 'string') {
      throw new Error(
        'If encoding is specified then the first argument must be a string'
      )
    }
    return allocUnsafe(this, arg)
  }
  return from(this, arg, encodingOrOffset, length)
}

Buffer.poolSize = 8192 // not used by this implementation

// TODO: Legacy, not needed anymore. Remove in next major version.
Buffer._augment = function (arr) {
  arr.__proto__ = Buffer.prototype
  return arr
}

function from (that, value, encodingOrOffset, length) {
  if (typeof value === 'number') {
    throw new TypeError('"value" argument must not be a number')
  }

  if (typeof ArrayBuffer !== 'undefined' && value instanceof ArrayBuffer) {
    return fromArrayBuffer(that, value, encodingOrOffset, length)
  }

  if (typeof value === 'string') {
    return fromString(that, value, encodingOrOffset)
  }

  return fromObject(that, value)
}

/**
 * Functionally equivalent to Buffer(arg, encoding) but throws a TypeError
 * if value is a number.
 * Buffer.from(str[, encoding])
 * Buffer.from(array)
 * Buffer.from(buffer)
 * Buffer.from(arrayBuffer[, byteOffset[, length]])
 **/
Buffer.from = function (value, encodingOrOffset, length) {
  return from(null, value, encodingOrOffset, length)
}

if (Buffer.TYPED_ARRAY_SUPPORT) {
  Buffer.prototype.__proto__ = Uint8Array.prototype
  Buffer.__proto__ = Uint8Array
  if (typeof Symbol !== 'undefined' && Symbol.species &&
      Buffer[Symbol.species] === Buffer) {
    // Fix subarray() in ES2016. See: https://github.com/feross/buffer/pull/97
    Object.defineProperty(Buffer, Symbol.species, {
      value: null,
      configurable: true
    })
  }
}

function assertSize (size) {
  if (typeof size !== 'number') {
    throw new TypeError('"size" argument must be a number')
  } else if (size < 0) {
    throw new RangeError('"size" argument must not be negative')
  }
}

function alloc (that, size, fill, encoding) {
  assertSize(size)
  if (size <= 0) {
    return createBuffer(that, size)
  }
  if (fill !== undefined) {
    // Only pay attention to encoding if it's a string. This
    // prevents accidentally sending in a number that would
    // be interpretted as a start offset.
    return typeof encoding === 'string'
      ? createBuffer(that, size).fill(fill, encoding)
      : createBuffer(that, size).fill(fill)
  }
  return createBuffer(that, size)
}

/**
 * Creates a new filled Buffer instance.
 * alloc(size[, fill[, encoding]])
 **/
Buffer.alloc = function (size, fill, encoding) {
  return alloc(null, size, fill, encoding)
}

function allocUnsafe (that, size) {
  assertSize(size)
  that = createBuffer(that, size < 0 ? 0 : checked(size) | 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) {
    for (var i = 0; i < size; ++i) {
      that[i] = 0
    }
  }
  return that
}

/**
 * Equivalent to Buffer(num), by default creates a non-zero-filled Buffer instance.
 * */
Buffer.allocUnsafe = function (size) {
  return allocUnsafe(null, size)
}
/**
 * Equivalent to SlowBuffer(num), by default creates a non-zero-filled Buffer instance.
 */
Buffer.allocUnsafeSlow = function (size) {
  return allocUnsafe(null, size)
}

function fromString (that, string, encoding) {
  if (typeof encoding !== 'string' || encoding === '') {
    encoding = 'utf8'
  }

  if (!Buffer.isEncoding(encoding)) {
    throw new TypeError('"encoding" must be a valid string encoding')
  }

  var length = byteLength(string, encoding) | 0
  that = createBuffer(that, length)

  var actual = that.write(string, encoding)

  if (actual !== length) {
    // Writing a hex string, for example, that contains invalid characters will
    // cause everything after the first invalid character to be ignored. (e.g.
    // 'abxxcd' will be treated as 'ab')
    that = that.slice(0, actual)
  }

  return that
}

function fromArrayLike (that, array) {
  var length = array.length < 0 ? 0 : checked(array.length) | 0
  that = createBuffer(that, length)
  for (var i = 0; i < length; i += 1) {
    that[i] = array[i] & 255
  }
  return that
}

function fromArrayBuffer (that, array, byteOffset, length) {
  array.byteLength // this throws if `array` is not a valid ArrayBuffer

  if (byteOffset < 0 || array.byteLength < byteOffset) {
    throw new RangeError('\'offset\' is out of bounds')
  }

  if (array.byteLength < byteOffset + (length || 0)) {
    throw new RangeError('\'length\' is out of bounds')
  }

  if (byteOffset === undefined && length === undefined) {
    array = new Uint8Array(array)
  } else if (length === undefined) {
    array = new Uint8Array(array, byteOffset)
  } else {
    array = new Uint8Array(array, byteOffset, length)
  }

  if (Buffer.TYPED_ARRAY_SUPPORT) {
    // Return an augmented `Uint8Array` instance, for best performance
    that = array
    that.__proto__ = Buffer.prototype
  } else {
    // Fallback: Return an object instance of the Buffer class
    that = fromArrayLike(that, array)
  }
  return that
}

function fromObject (that, obj) {
  if (Buffer.isBuffer(obj)) {
    var len = checked(obj.length) | 0
    that = createBuffer(that, len)

    if (that.length === 0) {
      return that
    }

    obj.copy(that, 0, 0, len)
    return that
  }

  if (obj) {
    if ((typeof ArrayBuffer !== 'undefined' &&
        obj.buffer instanceof ArrayBuffer) || 'length' in obj) {
      if (typeof obj.length !== 'number' || isnan(obj.length)) {
        return createBuffer(that, 0)
      }
      return fromArrayLike(that, obj)
    }

    if (obj.type === 'Buffer' && isArray(obj.data)) {
      return fromArrayLike(that, obj.data)
    }
  }

  throw new TypeError('First argument must be a string, Buffer, ArrayBuffer, Array, or array-like object.')
}

function checked (length) {
  // Note: cannot use `length < kMaxLength()` here because that fails when
  // length is NaN (which is otherwise coerced to zero.)
  if (length >= kMaxLength()) {
    throw new RangeError('Attempt to allocate Buffer larger than maximum ' +
                         'size: 0x' + kMaxLength().toString(16) + ' bytes')
  }
  return length | 0
}

function SlowBuffer (length) {
  if (+length != length) { // eslint-disable-line eqeqeq
    length = 0
  }
  return Buffer.alloc(+length)
}

Buffer.isBuffer = function isBuffer (b) {
  return !!(b != null && b._isBuffer)
}

Buffer.compare = function compare (a, b) {
  if (!Buffer.isBuffer(a) || !Buffer.isBuffer(b)) {
    throw new TypeError('Arguments must be Buffers')
  }

  if (a === b) return 0

  var x = a.length
  var y = b.length

  for (var i = 0, len = Math.min(x, y); i < len; ++i) {
    if (a[i] !== b[i]) {
      x = a[i]
      y = b[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

Buffer.isEncoding = function isEncoding (encoding) {
  switch (String(encoding).toLowerCase()) {
    case 'hex':
    case 'utf8':
    case 'utf-8':
    case 'ascii':
    case 'latin1':
    case 'binary':
    case 'base64':
    case 'ucs2':
    case 'ucs-2':
    case 'utf16le':
    case 'utf-16le':
      return true
    default:
      return false
  }
}

Buffer.concat = function concat (list, length) {
  if (!isArray(list)) {
    throw new TypeError('"list" argument must be an Array of Buffers')
  }

  if (list.length === 0) {
    return Buffer.alloc(0)
  }

  var i
  if (length === undefined) {
    length = 0
    for (i = 0; i < list.length; ++i) {
      length += list[i].length
    }
  }

  var buffer = Buffer.allocUnsafe(length)
  var pos = 0
  for (i = 0; i < list.length; ++i) {
    var buf = list[i]
    if (!Buffer.isBuffer(buf)) {
      throw new TypeError('"list" argument must be an Array of Buffers')
    }
    buf.copy(buffer, pos)
    pos += buf.length
  }
  return buffer
}

function byteLength (string, encoding) {
  if (Buffer.isBuffer(string)) {
    return string.length
  }
  if (typeof ArrayBuffer !== 'undefined' && typeof ArrayBuffer.isView === 'function' &&
      (ArrayBuffer.isView(string) || string instanceof ArrayBuffer)) {
    return string.byteLength
  }
  if (typeof string !== 'string') {
    string = '' + string
  }

  var len = string.length
  if (len === 0) return 0

  // Use a for loop to avoid recursion
  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'ascii':
      case 'latin1':
      case 'binary':
        return len
      case 'utf8':
      case 'utf-8':
      case undefined:
        return utf8ToBytes(string).length
      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return len * 2
      case 'hex':
        return len >>> 1
      case 'base64':
        return base64ToBytes(string).length
      default:
        if (loweredCase) return utf8ToBytes(string).length // assume utf8
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}
Buffer.byteLength = byteLength

function slowToString (encoding, start, end) {
  var loweredCase = false

  // No need to verify that "this.length <= MAX_UINT32" since it's a read-only
  // property of a typed array.

  // This behaves neither like String nor Uint8Array in that we set start/end
  // to their upper/lower bounds if the value passed is out of range.
  // undefined is handled specially as per ECMA-262 6th Edition,
  // Section 13.3.3.7 Runtime Semantics: KeyedBindingInitialization.
  if (start === undefined || start < 0) {
    start = 0
  }
  // Return early if start > this.length. Done here to prevent potential uint32
  // coercion fail below.
  if (start > this.length) {
    return ''
  }

  if (end === undefined || end > this.length) {
    end = this.length
  }

  if (end <= 0) {
    return ''
  }

  // Force coersion to uint32. This will also coerce falsey/NaN values to 0.
  end >>>= 0
  start >>>= 0

  if (end <= start) {
    return ''
  }

  if (!encoding) encoding = 'utf8'

  while (true) {
    switch (encoding) {
      case 'hex':
        return hexSlice(this, start, end)

      case 'utf8':
      case 'utf-8':
        return utf8Slice(this, start, end)

      case 'ascii':
        return asciiSlice(this, start, end)

      case 'latin1':
      case 'binary':
        return latin1Slice(this, start, end)

      case 'base64':
        return base64Slice(this, start, end)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return utf16leSlice(this, start, end)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = (encoding + '').toLowerCase()
        loweredCase = true
    }
  }
}

// The property is used by `Buffer.isBuffer` and `is-buffer` (in Safari 5-7) to detect
// Buffer instances.
Buffer.prototype._isBuffer = true

function swap (b, n, m) {
  var i = b[n]
  b[n] = b[m]
  b[m] = i
}

Buffer.prototype.swap16 = function swap16 () {
  var len = this.length
  if (len % 2 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 16-bits')
  }
  for (var i = 0; i < len; i += 2) {
    swap(this, i, i + 1)
  }
  return this
}

Buffer.prototype.swap32 = function swap32 () {
  var len = this.length
  if (len % 4 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 32-bits')
  }
  for (var i = 0; i < len; i += 4) {
    swap(this, i, i + 3)
    swap(this, i + 1, i + 2)
  }
  return this
}

Buffer.prototype.swap64 = function swap64 () {
  var len = this.length
  if (len % 8 !== 0) {
    throw new RangeError('Buffer size must be a multiple of 64-bits')
  }
  for (var i = 0; i < len; i += 8) {
    swap(this, i, i + 7)
    swap(this, i + 1, i + 6)
    swap(this, i + 2, i + 5)
    swap(this, i + 3, i + 4)
  }
  return this
}

Buffer.prototype.toString = function toString () {
  var length = this.length | 0
  if (length === 0) return ''
  if (arguments.length === 0) return utf8Slice(this, 0, length)
  return slowToString.apply(this, arguments)
}

Buffer.prototype.equals = function equals (b) {
  if (!Buffer.isBuffer(b)) throw new TypeError('Argument must be a Buffer')
  if (this === b) return true
  return Buffer.compare(this, b) === 0
}

Buffer.prototype.inspect = function inspect () {
  var str = ''
  var max = exports.INSPECT_MAX_BYTES
  if (this.length > 0) {
    str = this.toString('hex', 0, max).match(/.{2}/g).join(' ')
    if (this.length > max) str += ' ... '
  }
  return '<Buffer ' + str + '>'
}

Buffer.prototype.compare = function compare (target, start, end, thisStart, thisEnd) {
  if (!Buffer.isBuffer(target)) {
    throw new TypeError('Argument must be a Buffer')
  }

  if (start === undefined) {
    start = 0
  }
  if (end === undefined) {
    end = target ? target.length : 0
  }
  if (thisStart === undefined) {
    thisStart = 0
  }
  if (thisEnd === undefined) {
    thisEnd = this.length
  }

  if (start < 0 || end > target.length || thisStart < 0 || thisEnd > this.length) {
    throw new RangeError('out of range index')
  }

  if (thisStart >= thisEnd && start >= end) {
    return 0
  }
  if (thisStart >= thisEnd) {
    return -1
  }
  if (start >= end) {
    return 1
  }

  start >>>= 0
  end >>>= 0
  thisStart >>>= 0
  thisEnd >>>= 0

  if (this === target) return 0

  var x = thisEnd - thisStart
  var y = end - start
  var len = Math.min(x, y)

  var thisCopy = this.slice(thisStart, thisEnd)
  var targetCopy = target.slice(start, end)

  for (var i = 0; i < len; ++i) {
    if (thisCopy[i] !== targetCopy[i]) {
      x = thisCopy[i]
      y = targetCopy[i]
      break
    }
  }

  if (x < y) return -1
  if (y < x) return 1
  return 0
}

// Finds either the first index of `val` in `buffer` at offset >= `byteOffset`,
// OR the last index of `val` in `buffer` at offset <= `byteOffset`.
//
// Arguments:
// - buffer - a Buffer to search
// - val - a string, Buffer, or number
// - byteOffset - an index into `buffer`; will be clamped to an int32
// - encoding - an optional encoding, relevant is val is a string
// - dir - true for indexOf, false for lastIndexOf
function bidirectionalIndexOf (buffer, val, byteOffset, encoding, dir) {
  // Empty buffer means no match
  if (buffer.length === 0) return -1

  // Normalize byteOffset
  if (typeof byteOffset === 'string') {
    encoding = byteOffset
    byteOffset = 0
  } else if (byteOffset > 0x7fffffff) {
    byteOffset = 0x7fffffff
  } else if (byteOffset < -0x80000000) {
    byteOffset = -0x80000000
  }
  byteOffset = +byteOffset  // Coerce to Number.
  if (isNaN(byteOffset)) {
    // byteOffset: it it's undefined, null, NaN, "foo", etc, search whole buffer
    byteOffset = dir ? 0 : (buffer.length - 1)
  }

  // Normalize byteOffset: negative offsets start from the end of the buffer
  if (byteOffset < 0) byteOffset = buffer.length + byteOffset
  if (byteOffset >= buffer.length) {
    if (dir) return -1
    else byteOffset = buffer.length - 1
  } else if (byteOffset < 0) {
    if (dir) byteOffset = 0
    else return -1
  }

  // Normalize val
  if (typeof val === 'string') {
    val = Buffer.from(val, encoding)
  }

  // Finally, search either indexOf (if dir is true) or lastIndexOf
  if (Buffer.isBuffer(val)) {
    // Special case: looking for empty string/buffer always fails
    if (val.length === 0) {
      return -1
    }
    return arrayIndexOf(buffer, val, byteOffset, encoding, dir)
  } else if (typeof val === 'number') {
    val = val & 0xFF // Search for a byte value [0-255]
    if (Buffer.TYPED_ARRAY_SUPPORT &&
        typeof Uint8Array.prototype.indexOf === 'function') {
      if (dir) {
        return Uint8Array.prototype.indexOf.call(buffer, val, byteOffset)
      } else {
        return Uint8Array.prototype.lastIndexOf.call(buffer, val, byteOffset)
      }
    }
    return arrayIndexOf(buffer, [ val ], byteOffset, encoding, dir)
  }

  throw new TypeError('val must be string, number or Buffer')
}

function arrayIndexOf (arr, val, byteOffset, encoding, dir) {
  var indexSize = 1
  var arrLength = arr.length
  var valLength = val.length

  if (encoding !== undefined) {
    encoding = String(encoding).toLowerCase()
    if (encoding === 'ucs2' || encoding === 'ucs-2' ||
        encoding === 'utf16le' || encoding === 'utf-16le') {
      if (arr.length < 2 || val.length < 2) {
        return -1
      }
      indexSize = 2
      arrLength /= 2
      valLength /= 2
      byteOffset /= 2
    }
  }

  function read (buf, i) {
    if (indexSize === 1) {
      return buf[i]
    } else {
      return buf.readUInt16BE(i * indexSize)
    }
  }

  var i
  if (dir) {
    var foundIndex = -1
    for (i = byteOffset; i < arrLength; i++) {
      if (read(arr, i) === read(val, foundIndex === -1 ? 0 : i - foundIndex)) {
        if (foundIndex === -1) foundIndex = i
        if (i - foundIndex + 1 === valLength) return foundIndex * indexSize
      } else {
        if (foundIndex !== -1) i -= i - foundIndex
        foundIndex = -1
      }
    }
  } else {
    if (byteOffset + valLength > arrLength) byteOffset = arrLength - valLength
    for (i = byteOffset; i >= 0; i--) {
      var found = true
      for (var j = 0; j < valLength; j++) {
        if (read(arr, i + j) !== read(val, j)) {
          found = false
          break
        }
      }
      if (found) return i
    }
  }

  return -1
}

Buffer.prototype.includes = function includes (val, byteOffset, encoding) {
  return this.indexOf(val, byteOffset, encoding) !== -1
}

Buffer.prototype.indexOf = function indexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, true)
}

Buffer.prototype.lastIndexOf = function lastIndexOf (val, byteOffset, encoding) {
  return bidirectionalIndexOf(this, val, byteOffset, encoding, false)
}

function hexWrite (buf, string, offset, length) {
  offset = Number(offset) || 0
  var remaining = buf.length - offset
  if (!length) {
    length = remaining
  } else {
    length = Number(length)
    if (length > remaining) {
      length = remaining
    }
  }

  // must be an even number of digits
  var strLen = string.length
  if (strLen % 2 !== 0) throw new TypeError('Invalid hex string')

  if (length > strLen / 2) {
    length = strLen / 2
  }
  for (var i = 0; i < length; ++i) {
    var parsed = parseInt(string.substr(i * 2, 2), 16)
    if (isNaN(parsed)) return i
    buf[offset + i] = parsed
  }
  return i
}

function utf8Write (buf, string, offset, length) {
  return blitBuffer(utf8ToBytes(string, buf.length - offset), buf, offset, length)
}

function asciiWrite (buf, string, offset, length) {
  return blitBuffer(asciiToBytes(string), buf, offset, length)
}

function latin1Write (buf, string, offset, length) {
  return asciiWrite(buf, string, offset, length)
}

function base64Write (buf, string, offset, length) {
  return blitBuffer(base64ToBytes(string), buf, offset, length)
}

function ucs2Write (buf, string, offset, length) {
  return blitBuffer(utf16leToBytes(string, buf.length - offset), buf, offset, length)
}

Buffer.prototype.write = function write (string, offset, length, encoding) {
  // Buffer#write(string)
  if (offset === undefined) {
    encoding = 'utf8'
    length = this.length
    offset = 0
  // Buffer#write(string, encoding)
  } else if (length === undefined && typeof offset === 'string') {
    encoding = offset
    length = this.length
    offset = 0
  // Buffer#write(string, offset[, length][, encoding])
  } else if (isFinite(offset)) {
    offset = offset | 0
    if (isFinite(length)) {
      length = length | 0
      if (encoding === undefined) encoding = 'utf8'
    } else {
      encoding = length
      length = undefined
    }
  // legacy write(string, encoding, offset, length) - remove in v0.13
  } else {
    throw new Error(
      'Buffer.write(string, encoding, offset[, length]) is no longer supported'
    )
  }

  var remaining = this.length - offset
  if (length === undefined || length > remaining) length = remaining

  if ((string.length > 0 && (length < 0 || offset < 0)) || offset > this.length) {
    throw new RangeError('Attempt to write outside buffer bounds')
  }

  if (!encoding) encoding = 'utf8'

  var loweredCase = false
  for (;;) {
    switch (encoding) {
      case 'hex':
        return hexWrite(this, string, offset, length)

      case 'utf8':
      case 'utf-8':
        return utf8Write(this, string, offset, length)

      case 'ascii':
        return asciiWrite(this, string, offset, length)

      case 'latin1':
      case 'binary':
        return latin1Write(this, string, offset, length)

      case 'base64':
        // Warning: maxLength not taken into account in base64Write
        return base64Write(this, string, offset, length)

      case 'ucs2':
      case 'ucs-2':
      case 'utf16le':
      case 'utf-16le':
        return ucs2Write(this, string, offset, length)

      default:
        if (loweredCase) throw new TypeError('Unknown encoding: ' + encoding)
        encoding = ('' + encoding).toLowerCase()
        loweredCase = true
    }
  }
}

Buffer.prototype.toJSON = function toJSON () {
  return {
    type: 'Buffer',
    data: Array.prototype.slice.call(this._arr || this, 0)
  }
}

function base64Slice (buf, start, end) {
  if (start === 0 && end === buf.length) {
    return base64.fromByteArray(buf)
  } else {
    return base64.fromByteArray(buf.slice(start, end))
  }
}

function utf8Slice (buf, start, end) {
  end = Math.min(buf.length, end)
  var res = []

  var i = start
  while (i < end) {
    var firstByte = buf[i]
    var codePoint = null
    var bytesPerSequence = (firstByte > 0xEF) ? 4
      : (firstByte > 0xDF) ? 3
      : (firstByte > 0xBF) ? 2
      : 1

    if (i + bytesPerSequence <= end) {
      var secondByte, thirdByte, fourthByte, tempCodePoint

      switch (bytesPerSequence) {
        case 1:
          if (firstByte < 0x80) {
            codePoint = firstByte
          }
          break
        case 2:
          secondByte = buf[i + 1]
          if ((secondByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0x1F) << 0x6 | (secondByte & 0x3F)
            if (tempCodePoint > 0x7F) {
              codePoint = tempCodePoint
            }
          }
          break
        case 3:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0xC | (secondByte & 0x3F) << 0x6 | (thirdByte & 0x3F)
            if (tempCodePoint > 0x7FF && (tempCodePoint < 0xD800 || tempCodePoint > 0xDFFF)) {
              codePoint = tempCodePoint
            }
          }
          break
        case 4:
          secondByte = buf[i + 1]
          thirdByte = buf[i + 2]
          fourthByte = buf[i + 3]
          if ((secondByte & 0xC0) === 0x80 && (thirdByte & 0xC0) === 0x80 && (fourthByte & 0xC0) === 0x80) {
            tempCodePoint = (firstByte & 0xF) << 0x12 | (secondByte & 0x3F) << 0xC | (thirdByte & 0x3F) << 0x6 | (fourthByte & 0x3F)
            if (tempCodePoint > 0xFFFF && tempCodePoint < 0x110000) {
              codePoint = tempCodePoint
            }
          }
      }
    }

    if (codePoint === null) {
      // we did not generate a valid codePoint so insert a
      // replacement char (U+FFFD) and advance only 1 byte
      codePoint = 0xFFFD
      bytesPerSequence = 1
    } else if (codePoint > 0xFFFF) {
      // encode to utf16 (surrogate pair dance)
      codePoint -= 0x10000
      res.push(codePoint >>> 10 & 0x3FF | 0xD800)
      codePoint = 0xDC00 | codePoint & 0x3FF
    }

    res.push(codePoint)
    i += bytesPerSequence
  }

  return decodeCodePointsArray(res)
}

// Based on http://stackoverflow.com/a/22747272/680742, the browser with
// the lowest limit is Chrome, with 0x10000 args.
// We go 1 magnitude less, for safety
var MAX_ARGUMENTS_LENGTH = 0x1000

function decodeCodePointsArray (codePoints) {
  var len = codePoints.length
  if (len <= MAX_ARGUMENTS_LENGTH) {
    return String.fromCharCode.apply(String, codePoints) // avoid extra slice()
  }

  // Decode in chunks to avoid "call stack size exceeded".
  var res = ''
  var i = 0
  while (i < len) {
    res += String.fromCharCode.apply(
      String,
      codePoints.slice(i, i += MAX_ARGUMENTS_LENGTH)
    )
  }
  return res
}

function asciiSlice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i] & 0x7F)
  }
  return ret
}

function latin1Slice (buf, start, end) {
  var ret = ''
  end = Math.min(buf.length, end)

  for (var i = start; i < end; ++i) {
    ret += String.fromCharCode(buf[i])
  }
  return ret
}

function hexSlice (buf, start, end) {
  var len = buf.length

  if (!start || start < 0) start = 0
  if (!end || end < 0 || end > len) end = len

  var out = ''
  for (var i = start; i < end; ++i) {
    out += toHex(buf[i])
  }
  return out
}

function utf16leSlice (buf, start, end) {
  var bytes = buf.slice(start, end)
  var res = ''
  for (var i = 0; i < bytes.length; i += 2) {
    res += String.fromCharCode(bytes[i] + bytes[i + 1] * 256)
  }
  return res
}

Buffer.prototype.slice = function slice (start, end) {
  var len = this.length
  start = ~~start
  end = end === undefined ? len : ~~end

  if (start < 0) {
    start += len
    if (start < 0) start = 0
  } else if (start > len) {
    start = len
  }

  if (end < 0) {
    end += len
    if (end < 0) end = 0
  } else if (end > len) {
    end = len
  }

  if (end < start) end = start

  var newBuf
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    newBuf = this.subarray(start, end)
    newBuf.__proto__ = Buffer.prototype
  } else {
    var sliceLen = end - start
    newBuf = new Buffer(sliceLen, undefined)
    for (var i = 0; i < sliceLen; ++i) {
      newBuf[i] = this[i + start]
    }
  }

  return newBuf
}

/*
 * Need to make sure that buffer isn't trying to write out of bounds.
 */
function checkOffset (offset, ext, length) {
  if ((offset % 1) !== 0 || offset < 0) throw new RangeError('offset is not uint')
  if (offset + ext > length) throw new RangeError('Trying to access beyond buffer length')
}

Buffer.prototype.readUIntLE = function readUIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }

  return val
}

Buffer.prototype.readUIntBE = function readUIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    checkOffset(offset, byteLength, this.length)
  }

  var val = this[offset + --byteLength]
  var mul = 1
  while (byteLength > 0 && (mul *= 0x100)) {
    val += this[offset + --byteLength] * mul
  }

  return val
}

Buffer.prototype.readUInt8 = function readUInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  return this[offset]
}

Buffer.prototype.readUInt16LE = function readUInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return this[offset] | (this[offset + 1] << 8)
}

Buffer.prototype.readUInt16BE = function readUInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  return (this[offset] << 8) | this[offset + 1]
}

Buffer.prototype.readUInt32LE = function readUInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return ((this[offset]) |
      (this[offset + 1] << 8) |
      (this[offset + 2] << 16)) +
      (this[offset + 3] * 0x1000000)
}

Buffer.prototype.readUInt32BE = function readUInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] * 0x1000000) +
    ((this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    this[offset + 3])
}

Buffer.prototype.readIntLE = function readIntLE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var val = this[offset]
  var mul = 1
  var i = 0
  while (++i < byteLength && (mul *= 0x100)) {
    val += this[offset + i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readIntBE = function readIntBE (offset, byteLength, noAssert) {
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) checkOffset(offset, byteLength, this.length)

  var i = byteLength
  var mul = 1
  var val = this[offset + --i]
  while (i > 0 && (mul *= 0x100)) {
    val += this[offset + --i] * mul
  }
  mul *= 0x80

  if (val >= mul) val -= Math.pow(2, 8 * byteLength)

  return val
}

Buffer.prototype.readInt8 = function readInt8 (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 1, this.length)
  if (!(this[offset] & 0x80)) return (this[offset])
  return ((0xff - this[offset] + 1) * -1)
}

Buffer.prototype.readInt16LE = function readInt16LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset] | (this[offset + 1] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt16BE = function readInt16BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 2, this.length)
  var val = this[offset + 1] | (this[offset] << 8)
  return (val & 0x8000) ? val | 0xFFFF0000 : val
}

Buffer.prototype.readInt32LE = function readInt32LE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset]) |
    (this[offset + 1] << 8) |
    (this[offset + 2] << 16) |
    (this[offset + 3] << 24)
}

Buffer.prototype.readInt32BE = function readInt32BE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)

  return (this[offset] << 24) |
    (this[offset + 1] << 16) |
    (this[offset + 2] << 8) |
    (this[offset + 3])
}

Buffer.prototype.readFloatLE = function readFloatLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, true, 23, 4)
}

Buffer.prototype.readFloatBE = function readFloatBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 4, this.length)
  return ieee754.read(this, offset, false, 23, 4)
}

Buffer.prototype.readDoubleLE = function readDoubleLE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, true, 52, 8)
}

Buffer.prototype.readDoubleBE = function readDoubleBE (offset, noAssert) {
  if (!noAssert) checkOffset(offset, 8, this.length)
  return ieee754.read(this, offset, false, 52, 8)
}

function checkInt (buf, value, offset, ext, max, min) {
  if (!Buffer.isBuffer(buf)) throw new TypeError('"buffer" argument must be a Buffer instance')
  if (value > max || value < min) throw new RangeError('"value" argument is out of bounds')
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
}

Buffer.prototype.writeUIntLE = function writeUIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var mul = 1
  var i = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUIntBE = function writeUIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  byteLength = byteLength | 0
  if (!noAssert) {
    var maxBytes = Math.pow(2, 8 * byteLength) - 1
    checkInt(this, value, offset, byteLength, maxBytes, 0)
  }

  var i = byteLength - 1
  var mul = 1
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    this[offset + i] = (value / mul) & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeUInt8 = function writeUInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0xff, 0)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  this[offset] = (value & 0xff)
  return offset + 1
}

function objectWriteUInt16 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 2); i < j; ++i) {
    buf[offset + i] = (value & (0xff << (8 * (littleEndian ? i : 1 - i)))) >>>
      (littleEndian ? i : 1 - i) * 8
  }
}

Buffer.prototype.writeUInt16LE = function writeUInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeUInt16BE = function writeUInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0xffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

function objectWriteUInt32 (buf, value, offset, littleEndian) {
  if (value < 0) value = 0xffffffff + value + 1
  for (var i = 0, j = Math.min(buf.length - offset, 4); i < j; ++i) {
    buf[offset + i] = (value >>> (littleEndian ? i : 3 - i) * 8) & 0xff
  }
}

Buffer.prototype.writeUInt32LE = function writeUInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset + 3] = (value >>> 24)
    this[offset + 2] = (value >>> 16)
    this[offset + 1] = (value >>> 8)
    this[offset] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeUInt32BE = function writeUInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0xffffffff, 0)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

Buffer.prototype.writeIntLE = function writeIntLE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = 0
  var mul = 1
  var sub = 0
  this[offset] = value & 0xFF
  while (++i < byteLength && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i - 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeIntBE = function writeIntBE (value, offset, byteLength, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) {
    var limit = Math.pow(2, 8 * byteLength - 1)

    checkInt(this, value, offset, byteLength, limit - 1, -limit)
  }

  var i = byteLength - 1
  var mul = 1
  var sub = 0
  this[offset + i] = value & 0xFF
  while (--i >= 0 && (mul *= 0x100)) {
    if (value < 0 && sub === 0 && this[offset + i + 1] !== 0) {
      sub = 1
    }
    this[offset + i] = ((value / mul) >> 0) - sub & 0xFF
  }

  return offset + byteLength
}

Buffer.prototype.writeInt8 = function writeInt8 (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 1, 0x7f, -0x80)
  if (!Buffer.TYPED_ARRAY_SUPPORT) value = Math.floor(value)
  if (value < 0) value = 0xff + value + 1
  this[offset] = (value & 0xff)
  return offset + 1
}

Buffer.prototype.writeInt16LE = function writeInt16LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
  } else {
    objectWriteUInt16(this, value, offset, true)
  }
  return offset + 2
}

Buffer.prototype.writeInt16BE = function writeInt16BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 2, 0x7fff, -0x8000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 8)
    this[offset + 1] = (value & 0xff)
  } else {
    objectWriteUInt16(this, value, offset, false)
  }
  return offset + 2
}

Buffer.prototype.writeInt32LE = function writeInt32LE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value & 0xff)
    this[offset + 1] = (value >>> 8)
    this[offset + 2] = (value >>> 16)
    this[offset + 3] = (value >>> 24)
  } else {
    objectWriteUInt32(this, value, offset, true)
  }
  return offset + 4
}

Buffer.prototype.writeInt32BE = function writeInt32BE (value, offset, noAssert) {
  value = +value
  offset = offset | 0
  if (!noAssert) checkInt(this, value, offset, 4, 0x7fffffff, -0x80000000)
  if (value < 0) value = 0xffffffff + value + 1
  if (Buffer.TYPED_ARRAY_SUPPORT) {
    this[offset] = (value >>> 24)
    this[offset + 1] = (value >>> 16)
    this[offset + 2] = (value >>> 8)
    this[offset + 3] = (value & 0xff)
  } else {
    objectWriteUInt32(this, value, offset, false)
  }
  return offset + 4
}

function checkIEEE754 (buf, value, offset, ext, max, min) {
  if (offset + ext > buf.length) throw new RangeError('Index out of range')
  if (offset < 0) throw new RangeError('Index out of range')
}

function writeFloat (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 4, 3.4028234663852886e+38, -3.4028234663852886e+38)
  }
  ieee754.write(buf, value, offset, littleEndian, 23, 4)
  return offset + 4
}

Buffer.prototype.writeFloatLE = function writeFloatLE (value, offset, noAssert) {
  return writeFloat(this, value, offset, true, noAssert)
}

Buffer.prototype.writeFloatBE = function writeFloatBE (value, offset, noAssert) {
  return writeFloat(this, value, offset, false, noAssert)
}

function writeDouble (buf, value, offset, littleEndian, noAssert) {
  if (!noAssert) {
    checkIEEE754(buf, value, offset, 8, 1.7976931348623157E+308, -1.7976931348623157E+308)
  }
  ieee754.write(buf, value, offset, littleEndian, 52, 8)
  return offset + 8
}

Buffer.prototype.writeDoubleLE = function writeDoubleLE (value, offset, noAssert) {
  return writeDouble(this, value, offset, true, noAssert)
}

Buffer.prototype.writeDoubleBE = function writeDoubleBE (value, offset, noAssert) {
  return writeDouble(this, value, offset, false, noAssert)
}

// copy(targetBuffer, targetStart=0, sourceStart=0, sourceEnd=buffer.length)
Buffer.prototype.copy = function copy (target, targetStart, start, end) {
  if (!start) start = 0
  if (!end && end !== 0) end = this.length
  if (targetStart >= target.length) targetStart = target.length
  if (!targetStart) targetStart = 0
  if (end > 0 && end < start) end = start

  // Copy 0 bytes; we're done
  if (end === start) return 0
  if (target.length === 0 || this.length === 0) return 0

  // Fatal error conditions
  if (targetStart < 0) {
    throw new RangeError('targetStart out of bounds')
  }
  if (start < 0 || start >= this.length) throw new RangeError('sourceStart out of bounds')
  if (end < 0) throw new RangeError('sourceEnd out of bounds')

  // Are we oob?
  if (end > this.length) end = this.length
  if (target.length - targetStart < end - start) {
    end = target.length - targetStart + start
  }

  var len = end - start
  var i

  if (this === target && start < targetStart && targetStart < end) {
    // descending copy from end
    for (i = len - 1; i >= 0; --i) {
      target[i + targetStart] = this[i + start]
    }
  } else if (len < 1000 || !Buffer.TYPED_ARRAY_SUPPORT) {
    // ascending copy from start
    for (i = 0; i < len; ++i) {
      target[i + targetStart] = this[i + start]
    }
  } else {
    Uint8Array.prototype.set.call(
      target,
      this.subarray(start, start + len),
      targetStart
    )
  }

  return len
}

// Usage:
//    buffer.fill(number[, offset[, end]])
//    buffer.fill(buffer[, offset[, end]])
//    buffer.fill(string[, offset[, end]][, encoding])
Buffer.prototype.fill = function fill (val, start, end, encoding) {
  // Handle string cases:
  if (typeof val === 'string') {
    if (typeof start === 'string') {
      encoding = start
      start = 0
      end = this.length
    } else if (typeof end === 'string') {
      encoding = end
      end = this.length
    }
    if (val.length === 1) {
      var code = val.charCodeAt(0)
      if (code < 256) {
        val = code
      }
    }
    if (encoding !== undefined && typeof encoding !== 'string') {
      throw new TypeError('encoding must be a string')
    }
    if (typeof encoding === 'string' && !Buffer.isEncoding(encoding)) {
      throw new TypeError('Unknown encoding: ' + encoding)
    }
  } else if (typeof val === 'number') {
    val = val & 255
  }

  // Invalid ranges are not set to a default, so can range check early.
  if (start < 0 || this.length < start || this.length < end) {
    throw new RangeError('Out of range index')
  }

  if (end <= start) {
    return this
  }

  start = start >>> 0
  end = end === undefined ? this.length : end >>> 0

  if (!val) val = 0

  var i
  if (typeof val === 'number') {
    for (i = start; i < end; ++i) {
      this[i] = val
    }
  } else {
    var bytes = Buffer.isBuffer(val)
      ? val
      : utf8ToBytes(new Buffer(val, encoding).toString())
    var len = bytes.length
    for (i = 0; i < end - start; ++i) {
      this[i + start] = bytes[i % len]
    }
  }

  return this
}

// HELPER FUNCTIONS
// ================

var INVALID_BASE64_RE = /[^+\/0-9A-Za-z-_]/g

function base64clean (str) {
  // Node strips out invalid characters like \n and \t from the string, base64-js does not
  str = stringtrim(str).replace(INVALID_BASE64_RE, '')
  // Node converts strings with length < 2 to ''
  if (str.length < 2) return ''
  // Node allows for non-padded base64 strings (missing trailing ===), base64-js does not
  while (str.length % 4 !== 0) {
    str = str + '='
  }
  return str
}

function stringtrim (str) {
  if (str.trim) return str.trim()
  return str.replace(/^\s+|\s+$/g, '')
}

function toHex (n) {
  if (n < 16) return '0' + n.toString(16)
  return n.toString(16)
}

function utf8ToBytes (string, units) {
  units = units || Infinity
  var codePoint
  var length = string.length
  var leadSurrogate = null
  var bytes = []

  for (var i = 0; i < length; ++i) {
    codePoint = string.charCodeAt(i)

    // is surrogate component
    if (codePoint > 0xD7FF && codePoint < 0xE000) {
      // last char was a lead
      if (!leadSurrogate) {
        // no lead yet
        if (codePoint > 0xDBFF) {
          // unexpected trail
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        } else if (i + 1 === length) {
          // unpaired lead
          if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
          continue
        }

        // valid lead
        leadSurrogate = codePoint

        continue
      }

      // 2 leads in a row
      if (codePoint < 0xDC00) {
        if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        leadSurrogate = codePoint
        continue
      }

      // valid surrogate pair
      codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
    } else if (leadSurrogate) {
      // valid bmp char, but last char was a lead
      if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
    }

    leadSurrogate = null

    // encode utf8
    if (codePoint < 0x80) {
      if ((units -= 1) < 0) break
      bytes.push(codePoint)
    } else if (codePoint < 0x800) {
      if ((units -= 2) < 0) break
      bytes.push(
        codePoint >> 0x6 | 0xC0,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x10000) {
      if ((units -= 3) < 0) break
      bytes.push(
        codePoint >> 0xC | 0xE0,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else if (codePoint < 0x110000) {
      if ((units -= 4) < 0) break
      bytes.push(
        codePoint >> 0x12 | 0xF0,
        codePoint >> 0xC & 0x3F | 0x80,
        codePoint >> 0x6 & 0x3F | 0x80,
        codePoint & 0x3F | 0x80
      )
    } else {
      throw new Error('Invalid code point')
    }
  }

  return bytes
}

function asciiToBytes (str) {
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    // Node's code seems to be doing this and not & 0x7F..
    byteArray.push(str.charCodeAt(i) & 0xFF)
  }
  return byteArray
}

function utf16leToBytes (str, units) {
  var c, hi, lo
  var byteArray = []
  for (var i = 0; i < str.length; ++i) {
    if ((units -= 2) < 0) break

    c = str.charCodeAt(i)
    hi = c >> 8
    lo = c % 256
    byteArray.push(lo)
    byteArray.push(hi)
  }

  return byteArray
}

function base64ToBytes (str) {
  return base64.toByteArray(base64clean(str))
}

function blitBuffer (src, dst, offset, length) {
  for (var i = 0; i < length; ++i) {
    if ((i + offset >= dst.length) || (i >= src.length)) break
    dst[i + offset] = src[i]
  }
  return i
}

function isnan (val) {
  return val !== val // eslint-disable-line no-self-compare
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"base64-js":34,"ieee754":36,"isarray":37}],36:[function(require,module,exports){
exports.read = function (buffer, offset, isLE, mLen, nBytes) {
  var e, m
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var nBits = -7
  var i = isLE ? (nBytes - 1) : 0
  var d = isLE ? -1 : 1
  var s = buffer[offset + i]

  i += d

  e = s & ((1 << (-nBits)) - 1)
  s >>= (-nBits)
  nBits += eLen
  for (; nBits > 0; e = e * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  m = e & ((1 << (-nBits)) - 1)
  e >>= (-nBits)
  nBits += mLen
  for (; nBits > 0; m = m * 256 + buffer[offset + i], i += d, nBits -= 8) {}

  if (e === 0) {
    e = 1 - eBias
  } else if (e === eMax) {
    return m ? NaN : ((s ? -1 : 1) * Infinity)
  } else {
    m = m + Math.pow(2, mLen)
    e = e - eBias
  }
  return (s ? -1 : 1) * m * Math.pow(2, e - mLen)
}

exports.write = function (buffer, value, offset, isLE, mLen, nBytes) {
  var e, m, c
  var eLen = nBytes * 8 - mLen - 1
  var eMax = (1 << eLen) - 1
  var eBias = eMax >> 1
  var rt = (mLen === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0)
  var i = isLE ? 0 : (nBytes - 1)
  var d = isLE ? 1 : -1
  var s = value < 0 || (value === 0 && 1 / value < 0) ? 1 : 0

  value = Math.abs(value)

  if (isNaN(value) || value === Infinity) {
    m = isNaN(value) ? 1 : 0
    e = eMax
  } else {
    e = Math.floor(Math.log(value) / Math.LN2)
    if (value * (c = Math.pow(2, -e)) < 1) {
      e--
      c *= 2
    }
    if (e + eBias >= 1) {
      value += rt / c
    } else {
      value += rt * Math.pow(2, 1 - eBias)
    }
    if (value * c >= 2) {
      e++
      c /= 2
    }

    if (e + eBias >= eMax) {
      m = 0
      e = eMax
    } else if (e + eBias >= 1) {
      m = (value * c - 1) * Math.pow(2, mLen)
      e = e + eBias
    } else {
      m = value * Math.pow(2, eBias - 1) * Math.pow(2, mLen)
      e = 0
    }
  }

  for (; mLen >= 8; buffer[offset + i] = m & 0xff, i += d, m /= 256, mLen -= 8) {}

  e = (e << mLen) | m
  eLen += mLen
  for (; eLen > 0; buffer[offset + i] = e & 0xff, i += d, e /= 256, eLen -= 8) {}

  buffer[offset + i - d] |= s * 128
}

},{}],37:[function(require,module,exports){
var toString = {}.toString;

module.exports = Array.isArray || function (arr) {
  return toString.call(arr) == '[object Array]';
};

},{}]},{},[8]);
