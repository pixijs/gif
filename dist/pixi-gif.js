/*!
 * @pixi/gif - v1.1.1
 * https://github.com/pixijs/gif
 * Compiled Tue, 05 Jul 2022 17:59:42 UTC
 *
 * @pixi/gif is licensed under the MIT license.
 * http://www.opensource.org/licenses/mit-license
 */
this.PIXI = this.PIXI || {};
this.PIXI.gif = (function (exports, loaders, sprite, core, settings, constants, ticker) {
    'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */

    var extendStatics = function(d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };

    function __extends(d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }

    var __assign = function() {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }

    function __spreadArray(to, from, pack) {
        if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
            if (ar || !(i in from)) {
                if (!ar) ar = Array.prototype.slice.call(from, 0, i);
                ar[i] = from[i];
            }
        }
        return to.concat(ar || Array.prototype.slice.call(from));
    }

    var lib$1 = {};

    var gif = {};

    var lib = {};

    Object.defineProperty(lib, "__esModule", {
      value: true
    });
    lib.loop = lib.conditional = lib.parse = void 0;

    var parse = function parse(stream, schema) {
      var result = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : result;

      if (Array.isArray(schema)) {
        schema.forEach(function (partSchema) {
          return parse(stream, partSchema, result, parent);
        });
      } else if (typeof schema === 'function') {
        schema(stream, result, parent, parse);
      } else {
        var key = Object.keys(schema)[0];

        if (Array.isArray(schema[key])) {
          parent[key] = {};
          parse(stream, schema[key], result, parent[key]);
        } else {
          parent[key] = schema[key](stream, result, parent, parse);
        }
      }

      return result;
    };

    lib.parse = parse;

    var conditional = function conditional(schema, conditionFunc) {
      return function (stream, result, parent, parse) {
        if (conditionFunc(stream, result, parent)) {
          parse(stream, schema, result, parent);
        }
      };
    };

    lib.conditional = conditional;

    var loop = function loop(schema, continueFunc) {
      return function (stream, result, parent, parse) {
        var arr = [];
        var lastStreamPos = stream.pos;

        while (continueFunc(stream, result, parent)) {
          var newParent = {};
          parse(stream, schema, result, newParent); // cases when whole file is parsed but no termination is there and stream position is not getting updated as well
          // it falls into infinite recursion, null check to avoid the same

          if (stream.pos === lastStreamPos) {
            break;
          }

          lastStreamPos = stream.pos;
          arr.push(newParent);
        }

        return arr;
      };
    };

    lib.loop = loop;

    var uint8 = {};

    Object.defineProperty(uint8, "__esModule", {
      value: true
    });
    uint8.readBits = uint8.readArray = uint8.readUnsigned = uint8.readString = uint8.peekBytes = uint8.readBytes = uint8.peekByte = uint8.readByte = uint8.buildStream = void 0;

    // Default stream and parsers for Uint8TypedArray data type
    var buildStream = function buildStream(uint8Data) {
      return {
        data: uint8Data,
        pos: 0
      };
    };

    uint8.buildStream = buildStream;

    var readByte = function readByte() {
      return function (stream) {
        return stream.data[stream.pos++];
      };
    };

    uint8.readByte = readByte;

    var peekByte = function peekByte() {
      var offset = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
      return function (stream) {
        return stream.data[stream.pos + offset];
      };
    };

    uint8.peekByte = peekByte;

    var readBytes = function readBytes(length) {
      return function (stream) {
        return stream.data.subarray(stream.pos, stream.pos += length);
      };
    };

    uint8.readBytes = readBytes;

    var peekBytes = function peekBytes(length) {
      return function (stream) {
        return stream.data.subarray(stream.pos, stream.pos + length);
      };
    };

    uint8.peekBytes = peekBytes;

    var readString = function readString(length) {
      return function (stream) {
        return Array.from(readBytes(length)(stream)).map(function (value) {
          return String.fromCharCode(value);
        }).join('');
      };
    };

    uint8.readString = readString;

    var readUnsigned = function readUnsigned(littleEndian) {
      return function (stream) {
        var bytes = readBytes(2)(stream);
        return littleEndian ? (bytes[1] << 8) + bytes[0] : (bytes[0] << 8) + bytes[1];
      };
    };

    uint8.readUnsigned = readUnsigned;

    var readArray = function readArray(byteSize, totalOrFunc) {
      return function (stream, result, parent) {
        var total = typeof totalOrFunc === 'function' ? totalOrFunc(stream, result, parent) : totalOrFunc;
        var parser = readBytes(byteSize);
        var arr = new Array(total);

        for (var i = 0; i < total; i++) {
          arr[i] = parser(stream);
        }

        return arr;
      };
    };

    uint8.readArray = readArray;

    var subBitsTotal = function subBitsTotal(bits, startIndex, length) {
      var result = 0;

      for (var i = 0; i < length; i++) {
        result += bits[startIndex + i] && Math.pow(2, length - i - 1);
      }

      return result;
    };

    var readBits = function readBits(schema) {
      return function (stream) {
        var _byte = readByte()(stream); // convert the byte to bit array


        var bits = new Array(8);

        for (var i = 0; i < 8; i++) {
          bits[7 - i] = !!(_byte & 1 << i);
        } // convert the bit array to values based on the schema


        return Object.keys(schema).reduce(function (res, key) {
          var def = schema[key];

          if (def.length) {
            res[key] = subBitsTotal(bits, def.index, def.length);
          } else {
            res[key] = bits[def.index];
          }

          return res;
        }, {});
      };
    };

    uint8.readBits = readBits;

    (function (exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports["default"] = void 0;

    var _ = lib;

    var _uint = uint8;

    // a set of 0x00 terminated subblocks
    var subBlocksSchema = {
      blocks: function blocks(stream) {
        var terminator = 0x00;
        var chunks = [];
        var streamSize = stream.data.length;
        var total = 0;

        for (var size = (0, _uint.readByte)()(stream); size !== terminator; size = (0, _uint.readByte)()(stream)) {
          // size becomes undefined for some case when file is corrupted and  terminator is not proper 
          // null check to avoid recursion
          if (!size) break; // catch corrupted files with no terminator

          if (stream.pos + size >= streamSize) {
            var availableSize = streamSize - stream.pos;
            chunks.push((0, _uint.readBytes)(availableSize)(stream));
            total += availableSize;
            break;
          }

          chunks.push((0, _uint.readBytes)(size)(stream));
          total += size;
        }

        var result = new Uint8Array(total);
        var offset = 0;

        for (var i = 0; i < chunks.length; i++) {
          result.set(chunks[i], offset);
          offset += chunks[i].length;
        }

        return result;
      }
    }; // global control extension

    var gceSchema = (0, _.conditional)({
      gce: [{
        codes: (0, _uint.readBytes)(2)
      }, {
        byteSize: (0, _uint.readByte)()
      }, {
        extras: (0, _uint.readBits)({
          future: {
            index: 0,
            length: 3
          },
          disposal: {
            index: 3,
            length: 3
          },
          userInput: {
            index: 6
          },
          transparentColorGiven: {
            index: 7
          }
        })
      }, {
        delay: (0, _uint.readUnsigned)(true)
      }, {
        transparentColorIndex: (0, _uint.readByte)()
      }, {
        terminator: (0, _uint.readByte)()
      }]
    }, function (stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 0x21 && codes[1] === 0xf9;
    }); // image pipeline block

    var imageSchema = (0, _.conditional)({
      image: [{
        code: (0, _uint.readByte)()
      }, {
        descriptor: [{
          left: (0, _uint.readUnsigned)(true)
        }, {
          top: (0, _uint.readUnsigned)(true)
        }, {
          width: (0, _uint.readUnsigned)(true)
        }, {
          height: (0, _uint.readUnsigned)(true)
        }, {
          lct: (0, _uint.readBits)({
            exists: {
              index: 0
            },
            interlaced: {
              index: 1
            },
            sort: {
              index: 2
            },
            future: {
              index: 3,
              length: 2
            },
            size: {
              index: 5,
              length: 3
            }
          })
        }]
      }, (0, _.conditional)({
        lct: (0, _uint.readArray)(3, function (stream, result, parent) {
          return Math.pow(2, parent.descriptor.lct.size + 1);
        })
      }, function (stream, result, parent) {
        return parent.descriptor.lct.exists;
      }), {
        data: [{
          minCodeSize: (0, _uint.readByte)()
        }, subBlocksSchema]
      }]
    }, function (stream) {
      return (0, _uint.peekByte)()(stream) === 0x2c;
    }); // plain text block

    var textSchema = (0, _.conditional)({
      text: [{
        codes: (0, _uint.readBytes)(2)
      }, {
        blockSize: (0, _uint.readByte)()
      }, {
        preData: function preData(stream, result, parent) {
          return (0, _uint.readBytes)(parent.text.blockSize)(stream);
        }
      }, subBlocksSchema]
    }, function (stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 0x21 && codes[1] === 0x01;
    }); // application block

    var applicationSchema = (0, _.conditional)({
      application: [{
        codes: (0, _uint.readBytes)(2)
      }, {
        blockSize: (0, _uint.readByte)()
      }, {
        id: function id(stream, result, parent) {
          return (0, _uint.readString)(parent.blockSize)(stream);
        }
      }, subBlocksSchema]
    }, function (stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 0x21 && codes[1] === 0xff;
    }); // comment block

    var commentSchema = (0, _.conditional)({
      comment: [{
        codes: (0, _uint.readBytes)(2)
      }, subBlocksSchema]
    }, function (stream) {
      var codes = (0, _uint.peekBytes)(2)(stream);
      return codes[0] === 0x21 && codes[1] === 0xfe;
    });
    var schema = [{
      header: [{
        signature: (0, _uint.readString)(3)
      }, {
        version: (0, _uint.readString)(3)
      }]
    }, {
      lsd: [{
        width: (0, _uint.readUnsigned)(true)
      }, {
        height: (0, _uint.readUnsigned)(true)
      }, {
        gct: (0, _uint.readBits)({
          exists: {
            index: 0
          },
          resolution: {
            index: 1,
            length: 3
          },
          sort: {
            index: 4
          },
          size: {
            index: 5,
            length: 3
          }
        })
      }, {
        backgroundColorIndex: (0, _uint.readByte)()
      }, {
        pixelAspectRatio: (0, _uint.readByte)()
      }]
    }, (0, _.conditional)({
      gct: (0, _uint.readArray)(3, function (stream, result) {
        return Math.pow(2, result.lsd.gct.size + 1);
      })
    }, function (stream, result) {
      return result.lsd.gct.exists;
    }), // content frames
    {
      frames: (0, _.loop)([gceSchema, applicationSchema, commentSchema, imageSchema, textSchema], function (stream) {
        var nextCode = (0, _uint.peekByte)()(stream); // rather than check for a terminator, we should check for the existence
        // of an ext or image block to avoid infinite loops
        //var terminator = 0x3B;
        //return nextCode !== terminator;

        return nextCode === 0x21 || nextCode === 0x2c;
      })
    }];
    var _default = schema;
    exports["default"] = _default;
    }(gif));

    var deinterlace$1 = {};

    Object.defineProperty(deinterlace$1, "__esModule", {
      value: true
    });
    deinterlace$1.deinterlace = void 0;

    /**
     * Deinterlace function from https://github.com/shachaf/jsgif
     */
    var deinterlace = function deinterlace(pixels, width) {
      var newPixels = new Array(pixels.length);
      var rows = pixels.length / width;

      var cpRow = function cpRow(toRow, fromRow) {
        var fromPixels = pixels.slice(fromRow * width, (fromRow + 1) * width);
        newPixels.splice.apply(newPixels, [toRow * width, width].concat(fromPixels));
      }; // See appendix E.


      var offsets = [0, 4, 2, 1];
      var steps = [8, 8, 4, 2];
      var fromRow = 0;

      for (var pass = 0; pass < 4; pass++) {
        for (var toRow = offsets[pass]; toRow < rows; toRow += steps[pass]) {
          cpRow(toRow, fromRow);
          fromRow++;
        }
      }

      return newPixels;
    };

    deinterlace$1.deinterlace = deinterlace;

    var lzw$1 = {};

    Object.defineProperty(lzw$1, "__esModule", {
      value: true
    });
    lzw$1.lzw = void 0;

    /**
     * javascript port of java LZW decompression
     * Original java author url: https://gist.github.com/devunwired/4479231
     */
    var lzw = function lzw(minCodeSize, data, pixelCount) {
      var MAX_STACK_SIZE = 4096;
      var nullCode = -1;
      var npix = pixelCount;
      var available, clear, code_mask, code_size, end_of_information, in_code, old_code, bits, code, i, datum, data_size, first, top, bi, pi;
      var dstPixels = new Array(pixelCount);
      var prefix = new Array(MAX_STACK_SIZE);
      var suffix = new Array(MAX_STACK_SIZE);
      var pixelStack = new Array(MAX_STACK_SIZE + 1); // Initialize GIF data stream decoder.

      data_size = minCodeSize;
      clear = 1 << data_size;
      end_of_information = clear + 1;
      available = clear + 2;
      old_code = nullCode;
      code_size = data_size + 1;
      code_mask = (1 << code_size) - 1;

      for (code = 0; code < clear; code++) {
        prefix[code] = 0;
        suffix[code] = code;
      } // Decode GIF pixel stream.


      var datum, bits, first, top, pi, bi;
      datum = bits = first = top = pi = bi = 0;

      for (i = 0; i < npix;) {
        if (top === 0) {
          if (bits < code_size) {
            // get the next byte
            datum += data[bi] << bits;
            bits += 8;
            bi++;
            continue;
          } // Get the next code.


          code = datum & code_mask;
          datum >>= code_size;
          bits -= code_size; // Interpret the code

          if (code > available || code == end_of_information) {
            break;
          }

          if (code == clear) {
            // Reset decoder.
            code_size = data_size + 1;
            code_mask = (1 << code_size) - 1;
            available = clear + 2;
            old_code = nullCode;
            continue;
          }

          if (old_code == nullCode) {
            pixelStack[top++] = suffix[code];
            old_code = code;
            first = code;
            continue;
          }

          in_code = code;

          if (code == available) {
            pixelStack[top++] = first;
            code = old_code;
          }

          while (code > clear) {
            pixelStack[top++] = suffix[code];
            code = prefix[code];
          }

          first = suffix[code] & 0xff;
          pixelStack[top++] = first; // add a new string to the table, but only if space is available
          // if not, just continue with current table until a clear code is found
          // (deferred clear code implementation as per GIF spec)

          if (available < MAX_STACK_SIZE) {
            prefix[available] = old_code;
            suffix[available] = first;
            available++;

            if ((available & code_mask) === 0 && available < MAX_STACK_SIZE) {
              code_size++;
              code_mask += available;
            }
          }

          old_code = in_code;
        } // Pop a pixel off the pixel stack.


        top--;
        dstPixels[pi++] = pixelStack[top];
        i++;
      }

      for (i = pi; i < npix; i++) {
        dstPixels[i] = 0; // clear missing pixels
      }

      return dstPixels;
    };

    lzw$1.lzw = lzw;

    Object.defineProperty(lib$1, "__esModule", {
      value: true
    });
    var decompressFrames_1 = lib$1.decompressFrames = lib$1.decompressFrame = parseGIF_1 = lib$1.parseGIF = void 0;

    var _gif = _interopRequireDefault(gif);

    var _jsBinarySchemaParser = lib;

    var _uint = uint8;

    var _deinterlace = deinterlace$1;

    var _lzw = lzw$1;

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

    var parseGIF = function parseGIF(arrayBuffer) {
      var byteData = new Uint8Array(arrayBuffer);
      return (0, _jsBinarySchemaParser.parse)((0, _uint.buildStream)(byteData), _gif["default"]);
    };

    var parseGIF_1 = lib$1.parseGIF = parseGIF;

    var generatePatch = function generatePatch(image) {
      var totalPixels = image.pixels.length;
      var patchData = new Uint8ClampedArray(totalPixels * 4);

      for (var i = 0; i < totalPixels; i++) {
        var pos = i * 4;
        var colorIndex = image.pixels[i];
        var color = image.colorTable[colorIndex] || [0, 0, 0];
        patchData[pos] = color[0];
        patchData[pos + 1] = color[1];
        patchData[pos + 2] = color[2];
        patchData[pos + 3] = colorIndex !== image.transparentIndex ? 255 : 0;
      }

      return patchData;
    };

    var decompressFrame = function decompressFrame(frame, gct, buildImagePatch) {
      if (!frame.image) {
        console.warn('gif frame does not have associated image.');
        return;
      }

      var image = frame.image; // get the number of pixels

      var totalPixels = image.descriptor.width * image.descriptor.height; // do lzw decompression

      var pixels = (0, _lzw.lzw)(image.data.minCodeSize, image.data.blocks, totalPixels); // deal with interlacing if necessary

      if (image.descriptor.lct.interlaced) {
        pixels = (0, _deinterlace.deinterlace)(pixels, image.descriptor.width);
      }

      var resultImage = {
        pixels: pixels,
        dims: {
          top: frame.image.descriptor.top,
          left: frame.image.descriptor.left,
          width: frame.image.descriptor.width,
          height: frame.image.descriptor.height
        }
      }; // color table

      if (image.descriptor.lct && image.descriptor.lct.exists) {
        resultImage.colorTable = image.lct;
      } else {
        resultImage.colorTable = gct;
      } // add per frame relevant gce information


      if (frame.gce) {
        resultImage.delay = (frame.gce.delay || 10) * 10; // convert to ms

        resultImage.disposalType = frame.gce.extras.disposal; // transparency

        if (frame.gce.extras.transparentColorGiven) {
          resultImage.transparentIndex = frame.gce.transparentColorIndex;
        }
      } // create canvas usable imagedata if desired


      if (buildImagePatch) {
        resultImage.patch = generatePatch(resultImage);
      }

      return resultImage;
    };

    lib$1.decompressFrame = decompressFrame;

    var decompressFrames = function decompressFrames(parsedGif, buildImagePatches) {
      return parsedGif.frames.filter(function (f) {
        return f.image;
      }).map(function (f) {
        return decompressFrame(f, parsedGif.gct, buildImagePatches);
      });
    };

    decompressFrames_1 = lib$1.decompressFrames = decompressFrames;

    /**
     * Runtime object to play animated GIFs. This object is similar to an AnimatedSprite.
     * It support playback (seek, play, stop) as well as animation speed and looping.
     * @memberof PIXI.gif
     * @see Thanks to {@link https://github.com/matt-way/gifuct-js/ gifuct-js}
     */
    var AnimatedGIF = /** @class */ (function (_super) {
        __extends(AnimatedGIF, _super);
        /**
         * @param frames - Data of the GIF image.
         * @param options - Options for the AnimatedGIF
         */
        function AnimatedGIF(frames, options) {
            var _this = this;
            // Get the options, apply defaults
            var _a = Object.assign({}, AnimatedGIF.defaultOptions, options), scaleMode = _a.scaleMode, width = _a.width, height = _a.height, rest = __rest(_a, ["scaleMode", "width", "height"]);
            // Create the texture
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            canvas.width = width;
            canvas.height = height;
            _this = _super.call(this, core.Texture.from(canvas, { scaleMode: scaleMode })) || this;
            _this.duration = frames[frames.length - 1].end;
            _this._frames = frames;
            _this._context = context;
            _this._playing = false;
            _this._currentTime = 0;
            _this._isConnectedToTicker = false;
            Object.assign(_this, rest);
            // Draw the first frame
            _this.currentFrame = 0;
            if (_this.autoPlay) {
                _this.play();
            }
            return _this;
        }
        /**
         * Create an animated GIF animation from a GIF image's ArrayBuffer. The easiest way to get
         * the buffer is to use the Loader.
         * @example
         * const loader = new PIXI.Loader();
         * loader.add('myFile', 'file.gif');
         * loader.load((loader, resources) => {
         *    const gif = resources.myFile.animation;
         *    // add to the stage...
         * });
         * @param buffer - GIF image arraybuffer from loader.
         * @param options - Options to use.
         * @returns
         */
        AnimatedGIF.fromBuffer = function (buffer, options) {
            if (!buffer || buffer.byteLength === 0) {
                throw new Error('Invalid buffer');
            }
            // fix https://github.com/matt-way/gifuct-js/issues/30
            var validateAndFix = function (gif) {
                var _a;
                var currentGce = null;
                for (var _i = 0, _b = gif.frames; _i < _b.length; _i++) {
                    var frame = _b[_i];
                    currentGce = (_a = frame.gce) !== null && _a !== void 0 ? _a : currentGce;
                    // fix loosing graphic control extension for same frames
                    if ('image' in frame && !('gce' in frame)) {
                        frame.gce = currentGce;
                    }
                }
            };
            var gif = parseGIF_1(buffer);
            validateAndFix(gif);
            var gifFrames = decompressFrames_1(gif, true);
            var frames = [];
            // Temporary canvases required for compositing frames
            var canvas = document.createElement('canvas');
            var context = canvas.getContext('2d');
            var patchCanvas = document.createElement('canvas');
            var patchContext = patchCanvas.getContext('2d');
            canvas.width = gif.lsd.width;
            canvas.height = gif.lsd.height;
            var time = 0;
            // Some GIFs have a non-zero frame delay, so we need to calculate the fallback
            var fps = Object.assign({}, AnimatedGIF.defaultOptions, options).fps;
            var defaultDelay = 1000 / fps;
            // Precompute each frame and store as ImageData
            for (var i = 0; i < gifFrames.length; i++) {
                // Some GIF's omit the disposalType, so let's assume clear if missing
                var _a = gifFrames[i], _b = _a.disposalType, disposalType = _b === void 0 ? 2 : _b, _c = _a.delay, delay = _c === void 0 ? defaultDelay : _c, patch = _a.patch, _d = _a.dims, width_1 = _d.width, height_1 = _d.height, left = _d.left, top_1 = _d.top;
                patchCanvas.width = width_1;
                patchCanvas.height = height_1;
                patchContext.clearRect(0, 0, width_1, height_1);
                var patchData = patchContext.createImageData(width_1, height_1);
                patchData.data.set(patch);
                patchContext.putImageData(patchData, 0, 0);
                context.drawImage(patchCanvas, left, top_1);
                var imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                if (disposalType === 2 || disposalType === 3) {
                    context.clearRect(0, 0, canvas.width, canvas.height);
                }
                frames.push({
                    start: time,
                    end: time + delay,
                    imageData: imageData,
                });
                time += delay;
            }
            // clear the canvases
            canvas.width = canvas.height = 0;
            patchCanvas.width = patchCanvas.height = 0;
            var _e = gif.lsd, width = _e.width, height = _e.height;
            return new AnimatedGIF(frames, __assign({ width: width, height: height }, options));
        };
        /** Stops the animation. */
        AnimatedGIF.prototype.stop = function () {
            if (!this._playing) {
                return;
            }
            this._playing = false;
            if (this._autoUpdate && this._isConnectedToTicker) {
                ticker.Ticker.shared.remove(this.update, this);
                this._isConnectedToTicker = false;
            }
        };
        /** Plays the animation. */
        AnimatedGIF.prototype.play = function () {
            if (this._playing) {
                return;
            }
            this._playing = true;
            if (this._autoUpdate && !this._isConnectedToTicker) {
                ticker.Ticker.shared.add(this.update, this, ticker.UPDATE_PRIORITY.HIGH);
                this._isConnectedToTicker = true;
            }
            // If were on the last frame and stopped, play should resume from beginning
            if (!this.loop && this.currentFrame === this._frames.length - 1) {
                this._currentTime = 0;
            }
        };
        Object.defineProperty(AnimatedGIF.prototype, "progress", {
            /**
             * Get the current progress of the animation from 0 to 1.
             * @readonly
             */
            get: function () {
                return this._currentTime / this.duration;
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AnimatedGIF.prototype, "playing", {
            /** `true` if the current animation is playing */
            get: function () {
                return this._playing;
            },
            enumerable: false,
            configurable: true
        });
        /**
         * Updates the object transform for rendering. You only need to call this
         * if the `autoUpdate` property is set to `false`.
         *
         * @param deltaTime - Time since last tick.
         */
        AnimatedGIF.prototype.update = function (deltaTime) {
            var _a, _b;
            if (!this._playing) {
                return;
            }
            var elapsed = this.animationSpeed * deltaTime / settings.settings.TARGET_FPMS;
            var currentTime = this._currentTime + elapsed;
            var localTime = currentTime % this.duration;
            var localFrame = this._frames.findIndex(function (frame) {
                return frame.start <= localTime && frame.end > localTime;
            });
            if (currentTime >= this.duration) {
                if (this.loop) {
                    this._currentTime = localTime;
                    this.updateFrameIndex(localFrame);
                    (_a = this.onLoop) === null || _a === void 0 ? void 0 : _a.call(this);
                }
                else {
                    this._currentTime = this.duration;
                    this.updateFrameIndex(this._frames.length - 1);
                    (_b = this.onComplete) === null || _b === void 0 ? void 0 : _b.call(this);
                    this.stop();
                }
            }
            else {
                this._currentTime = localTime;
                this.updateFrameIndex(localFrame);
            }
        };
        /**
         * Redraw the current frame, is necessary for the animation to work when
         */
        AnimatedGIF.prototype.updateFrame = function () {
            if (!this.dirty) {
                return;
            }
            // Update the current frame
            var imageData = this._frames[this._currentFrame].imageData;
            this._context.putImageData(imageData, 0, 0);
            // Workaround hack for Safari & iOS
            // which fails to upload canvas after putImageData
            // See: https://bugs.webkit.org/show_bug.cgi?id=229986
            this._context.fillStyle = 'transparent';
            this._context.fillRect(0, 0, 0, 1);
            this.texture.update();
            // Mark as clean
            this.dirty = false;
        };
        /**
         * Renders the object using the WebGL renderer
         *
         * @param {PIXI.Renderer} renderer - The renderer
         * @private
         */
        AnimatedGIF.prototype._render = function (renderer) {
            this.updateFrame();
            _super.prototype._render.call(this, renderer);
        };
        /**
         * Renders the object using the WebGL renderer
         *
         * @param {PIXI.CanvasRenderer} renderer - The renderer
         * @private
         */
        // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
        AnimatedGIF.prototype._renderCanvas = function (renderer) {
            this.updateFrame();
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            _super.prototype._renderCanvas.call(this, renderer);
        };
        Object.defineProperty(AnimatedGIF.prototype, "autoUpdate", {
            /**
             * Whether to use PIXI.Ticker.shared to auto update animation time.
             * @default true
             */
            get: function () {
                return this._autoUpdate;
            },
            set: function (value) {
                if (value !== this._autoUpdate) {
                    this._autoUpdate = value;
                    if (!this._autoUpdate && this._isConnectedToTicker) {
                        ticker.Ticker.shared.remove(this.update, this);
                        this._isConnectedToTicker = false;
                    }
                    else if (this._autoUpdate && !this._isConnectedToTicker && this._playing) {
                        ticker.Ticker.shared.add(this.update, this);
                        this._isConnectedToTicker = true;
                    }
                }
            },
            enumerable: false,
            configurable: true
        });
        Object.defineProperty(AnimatedGIF.prototype, "currentFrame", {
            /** Set the current frame number */
            get: function () {
                return this._currentFrame;
            },
            set: function (value) {
                this.updateFrameIndex(value);
                this._currentTime = this._frames[value].start;
            },
            enumerable: false,
            configurable: true
        });
        /** Internally handle updating the frame index */
        AnimatedGIF.prototype.updateFrameIndex = function (value) {
            var _a;
            if (value < 0 || value >= this._frames.length) {
                throw new Error("Frame index out of range, expecting 0 to ".concat(this.totalFrames, ", got ").concat(value));
            }
            if (this._currentFrame !== value) {
                this._currentFrame = value;
                this.dirty = true;
                (_a = this.onFrameChange) === null || _a === void 0 ? void 0 : _a.call(this, value);
            }
        };
        Object.defineProperty(AnimatedGIF.prototype, "totalFrames", {
            /**
             * Get the total number of frame in the GIF.
             */
            get: function () {
                return this._frames.length;
            },
            enumerable: false,
            configurable: true
        });
        /** Destroy and don't use after this. */
        AnimatedGIF.prototype.destroy = function () {
            this.stop();
            _super.prototype.destroy.call(this, true);
            this._context = null;
            this._frames = null;
            this.onComplete = null;
            this.onFrameChange = null;
            this.onLoop = null;
        };
        /**
         * Cloning the animation is a useful way to create a duplicate animation.
         * This maintains all the properties of the original animation but allows
         * you to control playback independent of the original animation.
         * If you want to create a simple copy, and not control independently,
         * then you can simply create a new Sprite, e.g. `const sprite = new Sprite(animation.texture)`.
         */
        AnimatedGIF.prototype.clone = function () {
            return new AnimatedGIF(__spreadArray([], this._frames, true), {
                autoUpdate: this._autoUpdate,
                loop: this.loop,
                autoPlay: this.autoPlay,
                scaleMode: this.texture.baseTexture.scaleMode,
                animationSpeed: this.animationSpeed,
                width: this._context.canvas.width,
                height: this._context.canvas.height,
                onComplete: this.onComplete,
                onFrameChange: this.onFrameChange,
                onLoop: this.onLoop,
            });
        };
        /**
         * Default options for all AnimatedGIF objects.
         * @property {PIXI.SCALE_MODES} [scaleMode=PIXI.SCALE_MODES.LINEAR] - Scale mode to use for the texture.
         * @property {boolean} [loop=true] - To enable looping.
         * @property {number} [animationSpeed=1] - Speed of the animation.
         * @property {boolean} [autoUpdate=true] - Set to `false` to manage updates yourself.
         * @property {boolean} [autoPlay=true] - To start playing right away.
         * @property {Function} [onComplete=null] - The completed callback, optional.
         * @property {Function} [onLoop=null] - The loop callback, optional.
         * @property {Function} [onFrameChange=null] - The frame callback, optional.
         * @property {number} [fps=PIXI.Ticker.shared.FPS] - Default FPS.
         */
        AnimatedGIF.defaultOptions = {
            scaleMode: constants.SCALE_MODES.LINEAR,
            fps: ticker.Ticker.shared.FPS,
            loop: true,
            animationSpeed: 1,
            autoPlay: true,
            autoUpdate: true,
            onComplete: null,
            onFrameChange: null,
            onLoop: null,
        };
        return AnimatedGIF;
    }(sprite.Sprite));

    /** Default extension for GIF images */
    var GIF_EXTENSION = 'gif';
    /**
     * Handle the loading of GIF images. Registering this loader plugin will
     * load all `.gif` images as an ArrayBuffer and transform into an
     * AnimatedGIF object. Use Resource's `animation` property to access the object.
     * @memberof PIXI.gif
     * @class AnimatedGIFLoader
     * @example
     * import { Loader } from '@pixi/loaders';
     * import { AnimatedGIFLoader } from '@pixi/gif';
     *
     * Loader.registerPlugin(AnimatedGIFLoader);
     */
    var AnimatedGIFLoader = {
        /** For loading methods */
        add: function () {
            loaders.LoaderResource.setExtensionXhrType(GIF_EXTENSION, loaders.LoaderResource.XHR_RESPONSE_TYPE.BUFFER);
            loaders.LoaderResource.setExtensionLoadType(GIF_EXTENSION, loaders.LoaderResource.LOAD_TYPE.XHR);
        },
        /** Implement loader */
        use: function (resource, next) {
            if (resource.extension === GIF_EXTENSION) {
                resource.animation = AnimatedGIF.fromBuffer(resource.data);
            }
            next();
        }
    };

    exports.AnimatedGIF = AnimatedGIF;
    exports.AnimatedGIFLoader = AnimatedGIFLoader;

    Object.defineProperty(exports, '__esModule', { value: true });

    return exports;

})({}, PIXI, PIXI, PIXI, PIXI, PIXI, PIXI);
//# sourceMappingURL=pixi-gif.js.map
