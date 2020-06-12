var doAjaxPromise = function(ajaxUrl, ajaxType, ajaxData) {
    ajaxData["_t"] = new Date().getTime();
    var dataType = typeof arguments[3] !== "undefined" && typeof arguments[3]["dataType"] !== "undefined" ? arguments[3]["dataType"] : "json";
    var ajaxObj = {
        type: ajaxType,
        url: ajaxUrl,
        dataType: dataType,
        timeout: 5000,
        data: ajaxData,
    };
    var authToken = false, pjax = false;
    if (typeof arguments[3] === "object") {
        if (typeof arguments[3]["X-PJAX"] !== "undefined") {
            pjax = arguments[3]["X-PJAX"];
            delete arguments[3]["X-PJAX"];
        }
        $.extend(ajaxObj, arguments[3]);
    }
    ajaxObj.beforeSend = function (XHR) {
        if (pjax) {
            XHR.setRequestHeader('X-PJAX', pjax);
        }
    };
    return jQuery.ajax(ajaxObj);
};

var customPjax = function(aSelector, divSelector) {
    var pjaxEndEvent = $.Event('customPjax:end');

    var renderAction = function(divSelector, data, newTitle) {
        var responseDom = $(data);
        $(divSelector).html(responseDom);
        if (!$(divSelector).find("script").length) {
            responseDom.find('script').each(function() {
                if (this.src) {
                    var script = document.createElement('script'), i, attrName, attrValue, attrs = this.attributes;
                    for (i = 0; i < attrs.length; i++) {
                        attrName = attrs[i].name;
                        attrValue = attrs[i].value;
                        script[attrName] = attrValue;
                    }
                    $(divSelector)[0].appendChild(script);
                } else {
                    $.globalEval(this.text || this.textContent || this.innerHTML || '');
                }
            }).promise().done(function() {
                $(divSelector).show();
                document.title = newTitle;
                $(document).trigger(pjaxEndEvent);
                $(divSelector).find("a[data-pjax]").each(function() {
                    customPjax(this, $(this).data("custom-pjax-render-to") || "#pjax");
                });
            });
        } else {
            $(divSelector).show();
            document.title = newTitle;
            $(document).trigger(pjaxEndEvent);
            $(divSelector).find("a[data-pjax]").each(function() {
                customPjax(this, $(this).data("custom-pjax-render-to") || "#pjax");
            });
        }
    };

    var renderToDom = function(divSelector, data, newTitle) {
        data = data.replace(/<title>.*?<\/title>/, "");
        $(".pjaxLoader").hide();
        renderAction(divSelector, data, newTitle);
    };

    $(aSelector).each(function() {
        var uri = $(this).attr('href');
        uri = uri.match(/^\//) ? uri : "/" + uri;
        $(this).attr('href', 'javascript:void(0);');
        $(this).data('href', uri);
        $(this).on("click tap", function(evt) {
            window.backId && clearTimeout(window.backId);
            $(this).trigger($.Event('customPjax:start'));
            var loadDataAction = function(uri) {
                doAjaxPromise(uri, "get", {}, {"X-PJAX": "true", "dataType": "text"})
                    .success(function(data, status) {
                        if (status && data) {
                            var newTitleTmp = data.match(/<title>(.*?)<\/title>/),
                                newTitle = newTitleTmp ? newTitleTmp[1] : '';
                            if (history.pushState) {
                                window.history.pushState('', newTitle, uri);
                                if (!arguments[2]) {
                                    setMenu(location.pathname);
                                }
                            }
                            renderToDom(divSelector, data, newTitle);
                        }
                    });
            };
            $(divSelector).hide();
            $(".pjaxLoader").show();
            loadDataAction(uri);
            return false;
        });
    });

    if (!customPjax.prototype.initialization) {
        customPjax.prototype.initialization = true;
        window.onpopstate = function(evt) {
            $(divSelector).hide();
            var uri = location.pathname;
            doAjaxPromise(uri, "get", {}, {"X-PJAX": "true", "dataType": "text"})
                .success(function(data, status) {
                    if (status && data) {
                        var newTitle = data.match(/<title>(.*?)<\/title>/)[1];
                        renderToDom(divSelector, data, newTitle);
                    }
                });
        };
    }
};

var getQueryString = function(name) {
    if (name === void 0) {
        var params = {}, queryRegExp = new RegExp('([\\?|&])(.+?)=([^&?]*)', 'ig');
        var result = queryRegExp.exec(window.location.href);
        if (!result) {
            return null;
        }
        while (result) {
            params[result[2]] = result[3];
            result = queryRegExp.exec(window.location.href);
        }
        return params;
    }
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
};

var clearInput = function() {
    for (var i = 0; i < arguments.length; i++) {
        $(arguments[i]).customVal('');
    }
};

var isArray = function (o) {
    return Object.prototype.toString.call(o) === '[object Array]';
};

$.fn.customVal = function() {
    if (arguments.length > 1) {
        return this;
    }
    if (!this.length) {
        return this;
    }
    if (arguments[0] === null) {
        return this;
    }
    var tag = this.prop("tagName").toLowerCase();
    if (tag === "select") {
        var usedSelect2 = this.hasClass("select2-hidden-accessible");
        if (!arguments.length) {
            return this.val();
        } else {
            var optionsDom = this.find("option"), valueObj = [], selectedValueObj = [];
            for (var oi = 0; oi < optionsDom.length; oi++) {
                valueObj.push(optionsDom[oi].value);
            }
            for (var i = 0; i < arguments[0].length; i++) {
                if (valueObj.indexOf(arguments[0][i]) < 0) {
                    if (typeof arguments[0][i] === 'object') {
                        this.append($('<option />').attr("value", arguments[0][i]['value']).text(arguments[0][i]['text']));
                        selectedValueObj.push(arguments[0][i]['value']);
                    } else if (typeof arguments[0][i] === 'string') {
                        this.append($('<option />').attr("value", arguments[0][i]).text(arguments[0][i]));
                        selectedValueObj.push(arguments[0][i]);
                    }
                }
            }
            if (usedSelect2) {
                return this.val(selectedValueObj).trigger("change");
            } else {
                return this.val(selectedValueObj);
            }
        }
    } else if (tag === "textarea") {
        if (!arguments.length) {
            return this.val();
        } else {
            return this.val(arguments[0]);
        }
    } else if (tag === "input") {
        var type = this.attr("type") || "text";
        switch (type) {
            case "checkbox":
            case "radio":
                if (!arguments.length) {
                    var result = [];
                    this.filter(":checked").each(function() {
                        result.push($(this).val());
                    });
                    return (type === 'radio' ? result[0] : result);
                } else {
                    if (typeof arguments[0] !== "object") {
                        try {
                            var tmp = JSON.parse(arguments[0]);
                            if (typeof tmp !== 'object') {
                                throw false;
                            }
                            arguments[0] = tmp;
                        } catch(e) {
                            arguments[0] = [arguments[0]];
                        }
                    } else {
                        return this;
                    }
                    return this.val(arguments[0]);
                }
                break;
            default:
                if (!arguments.length) {
                    return this.val();
                } else {
                    return this.val(arguments[0]);
                }
                break;
        }
    } else {
        return this.val();
    }
};

$(function() {
    customPjax("a[data-pjax]", $(this).data("custom-pjax-render-to") || "#mainContainer");

    var addNavActive = function(selector) {
        var childrenLi = $(selector).children('li');
        for (var i = 0; i < childrenLi.length; i++) {
            var aDom = $(childrenLi[i]).find('a');
            if (aDom.length === 1) {
                if (aDom.data('href') === location.pathname) {
                    $(childrenLi[i]).addClass('active');
                }
            } else {
                addNavActive($(childrenLi[i]).find('ul.dropdown-menu'));
            }
        };
    };
    addNavActive('ul.navbar-nav');
    var activeParentUl = $(".navbar-nav li.active").parents('ul.dropdown-menu');
    activeParentUl.length && (activeParentUl.parent().addClass('active'));

    $(document).on('customPjax:start', function(evt) {
        $(".navbar-nav li.active").removeClass("active");
        if ($("#bs-example-navbar-collapse-6").hasClass("in")) {
            $("#bs-example-navbar-collapse-6").collapse('hide');
        }

        var clickedLi = $(evt.target).parent();
        clickedLi.addClass('active');
        var parentUl = clickedLi.parents('ul.dropdown-menu');
        if (parentUl) {
            parentUl.parent().addClass('active');
        }
        $("li.dropdown.open a.dropdown-toggle").dropdown('toggle');
    });

    $(document).on('customPjax:end', function(evt) {
        $(".navbar-nav li.active").removeClass("active");
        addNavActive('ul.navbar-nav');
        var activeParentUl = $(".navbar-nav li.active").parents('ul.dropdown-menu');
        activeParentUl.length && (activeParentUl.parent().addClass('active'));
    });
});

$.fn.serializeObject = function() {
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};
