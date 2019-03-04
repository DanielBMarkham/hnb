var __All_Questions_Checked = false;
var __No_Questions_Checked = true;
var __All_ExperienceLevels_Checked = false;
var __No_ExperienceLevels_Checked = true;
var __Questions_CheckState = [];
var __ExperienceLevels_CheckState = [];

//            __Questions_CheckState[qInx] = {ID:qNum, IsChecked:cked}; //cked;
function isQuestionIDChecked(qID) {
    ret = false;
    for (i = 0; i < __Questions_CheckState.length; i++) {
        if (__Questions_CheckState[i].ID == qID) {
            ret = __Questions_CheckState[i].IsChecked;
            break;
        }
    }
    return ret;
}
function isExperienceLevelsIDChecked(qID) {
    ret = false;
    for (i = 0; i < __ExperienceLevels_CheckState.length; i++) {
        if (__ExperienceLevels_CheckState[i].ID == qID) {
            ret = __ExperienceLevels_CheckState[i].IsChecked;
            break;
        }
    }
    return ret;
} 



function filterArray(arr, f) {
            var len = arr.length;
            var res = new Array();
            var thisp = arguments[0];
            for (var i = 0; i < len; i++) {
                if (i in arr) {
                    var val = arr[i]; // in case fun mutates this
                    if (f(val, i, arr))
                        res.push(val);
                }
            }
            return res;
}

function filterBooksBySelectors() {
    var newBooks = bookFilter(Books);
    var newFilteredBooks = newBooks.sort(bookSort);
    zapBookListInDOM();
    addBookArrayToDOM(newBooks);
}

function getBookScore(book) {
    total = 0;
    cnt = 0;
    for (j = 0; j < book.QuestionsAnswered.length; j++) {
        cked = isQuestionIDChecked(book.QuestionsAnswered[j].QuestionID);  //$("#Question" + book.QuestionsAnswered[j].QuestionID).is(':checked');
        if ((true === cked) || (true === __No_Questions_Checked)) {
            // go through the experience levels and add up the scores for the boxes that are checked
            for (k = 0; k < book.QuestionsAnswered[j].ExperienceLevels.length; k++) {
                expLevelBeingChecked = book.QuestionsAnswered[j].ExperienceLevels[k].ExperienceLevelID;
                // is the checkbox checked? If so, add in the score and increase the count
                expcked = isExperienceLevelsIDChecked(expLevelBeingChecked);  //$("#ExperienceLevel" + expLevelBeingChecked).is(':checked');
                if ((true === expcked) || (true === __No_ExperienceLevels_Checked)) {
                    total = total + parseFloat(book.QuestionsAnswered[j].ExperienceLevels[k].Score);
                    cnt++;
                }
            }
        }
    }
    if (cnt != 0) {
        ret = total / cnt;
        return ret;
    }
    else {
        return 0;
    }

}
function bookSort(a, b) {
    return getBookScore(a) < getBookScore(b)
}
var SELECTOR_MATCH_TYPE = "AND";
function bookMatchWithSelectors(book, index, array){
    ret = false;
    if (SELECTOR_MATCH_TYPE === "OR") {
        for (j = 0; j < book.QuestionsAnswered.length; j++) {
            cked = $("#Question" + book.QuestionsAnswered[j].QuestionID).is(':checked');
            if (cked === true) {
                ret = true;
                break;
            }
        }
    }
    else if (SELECTOR_MATCH_TYPE === "AND") {
        ret = true;
        for (j = 1; j <= Questions.length; j++) {
            cked = $("#Question" + j).is(':checked');
            if (cked) {
                temp = false;
                for (k = 0; k < book.QuestionsAnswered.length; k++) {
                    if (book.QuestionsAnswered[k].QuestionID == j) {
                        temp = true;
                        break;
                    }
                }
            ret = ret && temp;
            }
        }
    }
    return ret;
}
function bookFilter(input) {
    temp = input.slice();
    // if none of the checkboxes are checked, return everything
    if ($('#Questions > .sortList > input[type=checkbox]:checked').length === 0) {
        ret = temp;
    }
    else {
        try{        
            ret = temp.filter(bookMatchWithSelectors);
            }
        catch(e)
        {
        ret = filterArray(temp, bookMatchWithSelectors);
        }
    }
    return ret; 
}

jQuery.fn.fadeThenSlideToggle = function (speed, easing, callback) {
    if (this.is(":hidden")) {
        return this.slideDown(speed, easing).fadeTo(speed, 1, easing, callback);
    } else {
        return this.fadeTo(speed, 0, easing).slideUp(speed, easing, callback);
    }
};

function addSortingTags() {
    var qListDiv = $("#Questions");
    var qTemplate = "<div class=\"sortList\"><input type=\"checkbox\" id=\"Question###QUESTIONID###\" onclick=\"{selectorClick(this)};\" /><label>#######</label></div>";
    for (i = 0; i < Questions.length; i++) {
        var quest = Questions[i].Desc;
        var tempWithQUESTIONID = qTemplate.replace("###QUESTIONID###", Questions[i].ID);
        var filledTemplate = tempWithQUESTIONID.replace("#######", quest);
        qListDiv.append(filledTemplate);
    }
    var eTemplate = "<div class=\"sortList\"><input type=\"checkbox\" id=\"ExperienceLevel###EXPERIENCELEVEL###\" onclick=\"{selectorClick(this)};\" /><label>#######</label></div>";
    var qListDiv = $("#ExperienceLevels");
    for (i = 0; i < ExperienceLevels.length; i++) {
        var experienceLevelDescription = ExperienceLevels[i].Desc;
        var tempWithEXPERIENCELEVELID = eTemplate.replace("###EXPERIENCELEVEL###", ExperienceLevels[i].ID);
        var filledTemplate = tempWithEXPERIENCELEVELID.replace("#######", experienceLevelDescription);
        qListDiv.append(filledTemplate);
    }
}
function addBookArrayToDOM(bookArray) {
    $(".Books").append("<ul></ul>");
    var bookListDiv = $(".Books > ul");
    bookListDiv.hide();

    var bookListTemplate = "<li><a name=\"###BOOKNUMBER###\"></a><div class=\"span-3\"><img src=\"#$#SMALLPICTURELINK#$#\" alt=\"###BOOKTITLE###\" /><br/><a class=\"button-red\"> <span class=\"button-red-inner book###BOOKNUMBER###Button\">Zoom</span> <span class=\"square-red-shade\"></span></a></div><div class=\"span-13 last\"><h4>###BOOKTITLE###</h4>#$#HTMLDESCRIPTION#$#</div>";
    var formatPurchaseLinkTemplate = "<a class=\"button-red\" href=\'#$#PURCHASELINK#$#\' > <span class=\"button-red-inner\"> #$#FORMATNAME#$#</span> <span class=\"square-red-shade\"></span> </a> ";
    //bookListTemplate += "<div class=\"span-16 bottomBar\"><div class=\"span-3 bottomBarLeft\"><a class=\"button-red\"> <span class=\"button-red-inner book###BOOKNUMBER###LinksButton hnlinksButton\">Links</span> <span class=\"square-red-shade\"></span></a></div>";
    bookListTemplate += "<div class=\"span-16 bottomBar\"><div class=\"span-3 bottomBarLeft\">&nbsp;&nbsp;</div>";
    bookListTemplate += "<div class=\"span-13 bottomBarRight last\">#$#FORMATPURCHASELINK#$#</div></div></li>";
    for (j = 0; j < bookArray.length; j++) {
        var tempWithTitle = bookListTemplate.replace(/###BOOKTITLE###/g, bookArray[j].Title);
        var tempWithSmallPic = tempWithTitle.replace("#$#SMALLPICTURELINK#$#", bookArray[j].SmallPictureLink);
        var tempWithHtmlDescription = tempWithSmallPic.replace("#$#HTMLDESCRIPTION#$#", bookArray[j].HtmlDescription);
        var bookNumber = bookArray[j].ID;  //j+1;
        var tempWithBookNum = tempWithHtmlDescription.replace(/###BOOKNUMBER###/g, bookNumber);
        var purcLinks = "";
        var purcArrayLen = bookArray[j].wPurchaseInfo.length;
        for (i = 0; i < purcArrayLen; i++) {
            n1 = formatPurchaseLinkTemplate.replace("#$#PURCHASELINK#$#", bookArray[j].wPurchaseInfo[i].PurchaseLink);
            n2 = n1.replace("#$#FORMATNAME#$#", bookArray[j].wPurchaseInfo[i].Format);
            purcLinks += n2;
        }

        tempWithButtons = tempWithBookNum.replace("#$#FORMATPURCHASELINK#$#", purcLinks);
        bookListDiv.append(tempWithButtons);
        bookListDiv.show();
        // hook up zoom button
        var buttonClassName = ".book" + bookNumber + "Button";
        $(buttonClassName).colorbox({ href: bookArray[j].LargePictureLink });
    }
}

function zapBookListInDOM() {
    $(".Books > ul").fadeThenSlideToggle().remove();
}

function updateDynamicContent() {
    zapBookListInDOM();
    addBookArrayToDOM(Books);
}




(function (__global) {

    var t = new Date();

    // make sure `window` resolves to a global object
    var window = this;

    var features = {};
    var bugs = {};

    features.IS_CSS_TRANSFORMATION_SUPPORTED = (features.__IS_CSS_TRANSFORMATION_SUPPORTED = function () {
        var docEl = document.documentElement, s;
        if (docEl && (s = docEl.style)) {
            return (typeof s.WebkitTransform == 'string'
        || typeof s.MozTransform == 'string');
        }
        return null;
    })();

    features.IS_ELEMENT_TAGNAME_UPPERCASED = (features.__IS_ELEMENT_TAGNAME_UPPERCASED = function () {
        var docEl = document.documentElement;
        if (docEl) {
            return 'HTML' === docEl.nodeName;
        }
        return null;
    })();

    bugs.QUERY_SELECTOR_IGNORES_CAPITALIZED_VALUES = (bugs.__QUERY_SELECTOR_IGNORES_CAPITALIZED_VALUES = function () {
        if (document.createElement && (document.compatMode === 'BackCompat')) {
            var el = document.createElement('div'),
          el2 = document.createElement('span');
            if (el && el2 && el.appendChild && el.querySelector) {
                el2.className = 'Test';
                el.appendChild(el2);
                var isBuggy = (el.querySelector('.Test') !== null);
                el = el2 = null;
                return isBuggy;
            }
        }
        return null;
    })();

    features.ARRAY_PROTOTYPE_SLICE_CAN_CONVERT_NODELIST_TO_ARRAY = (features.__ARRAY_PROTOTYPE_SLICE_CAN_CONVERT_NODELIST_TO_ARRAY = function () {
        try {
            return (Array.prototype.slice.call(document.forms, 0) instanceof Array);
        }
        catch (e) {
            return false;
        }
    })();

    features.WINDOW_EVAL_EVALUATES_IN_GLOBAL_SCOPE = (features.__WINDOW_EVAL_EVALUATES_IN_GLOBAL_SCOPE = function () {
        var fnId = '__eval' + Number(new Date()),
        passed = false;

        try {
            // catch indirect eval call errors (i.e. in such clients as Blackberry 9530)
            window.eval('var ' + fnId + '=true');
        } catch (e) { }
        passed = (window[fnId] === true);
        if (passed) {
            try {
                delete window[fnId];
            }
            catch (e) {
                window[fnId] = void 0;
            }
        }
        return passed;
    })();

    (features.__IS_EVENT_METAKEY_PRESENT =
    features.__IS_EVENT_PREVENTDEFAULT_PRESENT =
    features.__IS_EVENT_SRCELEMENT_PRESENT =
    features.__IS_EVENT_RELATEDTARGET_PRESENT = function () {

        features.IS_EVENT_METAKEY_PRESENT = null;
        features.IS_EVENT_PREVENTDEFAULT_PRESENT = null;
        features.IS_EVENT_SRCELEMENT_PRESENT = null;
        features.IS_EVENT_RELATEDTARGET_PRESENT = null;

        if (document.createElement) {
            var i = document.createElement('input'),
          root = document.documentElement;
            if (i && i.style && i.click && root && root.appendChild && root.removeChild) {
                i.type = 'checkbox';
                i.style.display = 'none';
                i.onclick = function (e) {
                    e = e || window.event;
                    features.IS_EVENT_METAKEY_PRESENT = ('metaKey' in e);
                    features.IS_EVENT_PREVENTDEFAULT_PRESENT = ('preventDefault' in e);
                    features.IS_EVENT_SRCELEMENT_PRESENT = ('srcElement' in e);
                    features.IS_EVENT_RELATEDTARGET_PRESENT = ('relatedTarget' in e);
                };
                root.appendChild(i);
                i.click();
                root.removeChild(i);
                i.onclick = null;
                i = null;
            }
        }
    })();

    features.IS_NATIVE_HAS_ATTRIBUTE_PRESENT = (features.__IS_NATIVE_HAS_ATTRIBUTE_PRESENT = function () {
        if (document.createElement) {
            var i = document.createElement('iframe'),
          root = document.documentElement,
          frames = window.frames;
            if (root && root.appendChild && root.removeChild) {
                i.style.display = 'none';
                root.appendChild(i);
                // some clients (e.g. Blackberry 9000 (Bold)) throw error when accesing frame's document
                try {
                    var frame = frames[frames.length - 1];
                    if (frame) {
                        var doc = frame.document;
                        if (doc && doc.write) {
                            doc.write('<html><head><title></title></head><body></body></html>');
                            var isPresent = doc.documentElement ? ('hasAttribute' in doc.documentElement) : null;
                            root.removeChild(i);
                            i = null;
                            return isPresent;
                        }
                    }
                } catch (e) {
                    return null;
                }
            }
        }
        return null;
    })();

    features.IS_POSITION_FIXED_SUPPORTED = (features.__IS_POSITION_FIXED_SUPPORTED = function () {
        var isSupported = null;
        if (document.createElement) {
            var el = document.createElement('div');
            if (el && el.style) {
                el.style.position = 'fixed';
                el.style.top = '10px';
                var root = document.body;
                if (root &&
            root.appendChild &&
            root.removeChild) {
                    root.appendChild(el);
                    isSupported = (el.offsetTop === 10);
                    root.removeChild(el);
                }
            }
        }
        return isSupported;
    })();

    // Thanks to David Mark for suggestion
    features.IS_CONTEXTMENU_EVENT_SUPPORTED = (features.__IS_CONTEXTMENU_EVENT_SUPPORTED = function () {
        var isPresent = null;
        if (document.createElement) {
            var el = document.createElement('p');
            if (el && el.setAttribute) {
                el.setAttribute('oncontextmenu', '');
                isPresent = (typeof el.oncontextmenu != 'undefined');
            }
        }
        return isPresent;
    })();

    // Opera 9.x (possibly other versions as well) returns actual values (instead of "auto") 
    // for statically positioned elements
    features.COMPUTED_STYLE_RETURNS_VALUES_FOR_STATICLY_POSITIONED_ELEMENTS = (
  features.__COMPUTED_STYLE_RETURNS_VALUES_FOR_STATICLY_POSITIONED_ELEMENTS = function () {
      var view = document.defaultView;
      if (view && view.getComputedStyle) {
          var docEl = document.documentElement;
          var position = null;
          var style = view.getComputedStyle(docEl, null);
          // if element is not statically positioned, make it as such, then restore
          if (style.position !== 'static') {
              position = style.position;
              docEl.style.position = '';
          }
          var result = (view.getComputedStyle(docEl, null).left !== 'auto');
          if (position !== null) {
              docEl.style.position = position;
          }
          return result;
      }
      return null;
  })();

    features.IS_RGBA_SUPPORTED = (features.__IS_RGBA_SUPPORTED = function () {
        var result = null;
        if (document.createElement) {
            var value = 'rgba(1,1,1,0.5)',
          el = document.createElement('p'),
          re = /^rgba/;
            if (el && el.style && typeof re.test == 'function') {
                try {
                    el.style.color = value;
                    result = re.test(el.style.color);
                }
                catch (e) {
                    result = false;
                }
            }
        }
        return result;
    })();

    features.IS_CSS_BORDER_RADIUS_SUPPORTED = (features.__IS_CSS_BORDER_RADIUS_SUPPORTED = function () {
        var docEl = document.documentElement, s;
        if (docEl && (s = docEl.style)) {
            return (typeof s.borderRadius == 'string'
        || typeof s.MozBorderRadius == 'string'
        || typeof s.WebkitBorderRadius == 'string'
        || typeof s.KhtmlBorderRadius == 'string');
        }
        return null;
    })();

    features.IS_CANVAS_SUPPORTED = (features.__IS_CANVAS_SUPPORTED = function () {
        if (document.createElement) {
            var elCanvas = document.createElement('canvas');
            return !!(elCanvas && elCanvas.getContext && elCanvas.getContext('2d'));
        }
        return null;
    })();

    features.ELEMENT_CHILDREN_RETURNS_ELEMENT_NODES = (features.__ELEMENT_CHILDREN_RETURNS_ELEMENT_NODES = function () {
        var isSupported = null,
        docEl = document.documentElement;
        if (document.createElement && typeof docEl.children != 'undefined') {
            var el = document.createElement('div');
            el.innerHTML = '<div><p>a<\/p><\/div>b<!-- x -->';
            // Safari 2.x returns ALL elements in `children`
            // We check that first element is a DIV and that it's the only one element returned
            isSupported = (el.children &&
        el.children.length === 1 &&
        el.children[0] &&
        el.children[0].tagName &&
        el.children[0].tagName.toUpperCase() === 'DIV');
        }
        return isSupported;
    })();

    features.IS_CSS_ENABLED = (features.__IS_CSS_ENABLED = function () {
        var body = document.body,
        isSupported = null;
        if (document.createElement &&
        body &&
        body.appendChild &&
        body.removeChild) {
            var el = document.createElement('div');
            if (el && el.style) {
                el.style.display = 'none';
                body.appendChild(el);
                isSupported = (el.offsetWidth === 0);
                body.removeChild(el);
            }
        }
        return isSupported;
    })();

    // features.IS_DOMFOCUSIN_SUPPORTED = (features.__IS_DOMFOCUSIN_SUPPORTED = function(){
    //     var body = document.body,
    //         isSupported = null;
    //     if (document.createElement && 
    //         body && 
    //         body.insertBefore && 
    //         body.removeChild) {
    //       var el = document.createElement('DIV');
    //       if (el && el.addEventListener && el.focus) {
    //         isSupported = false;
    //         el.addEventListener('DOMFocusIn', function(){ isSupported = true; }, false);
    //         el.tabIndex = -1;
    //         body.insertBefore(el, body.firstChild);
    //         el.focus();
    //         body.removeChild(el);
    //       }
    //     }
    //     return isSupported;
    //   })();

    features.IS_QUIRKS_MODE = (features.__IS_QUIRKS_MODE = function () {
        if (document.createElement) {
            var el = document.createElement('div');
            if (el && el.style) {
                el.style.width = '1';
            }
            return el.style.width === '1px';
        }
    })();

    features.IS_CONTAINS_BUGGY = (features.__IS_CONTAINS_BUGGY = function () {
        if (document.createElement) {
            var el1 = document.createElement('div'),
          el2 = document.createElement('div');
            if (el1 && el2 && el1.contains) {
                return el1.contains(el2);
            }
        }
        return null;
    })();

    // as per M. Miller advice
    features.IS_STRICT_MODE_SUPPORTED = (features.__IS_STRICT_MODE_SUPPORTED = function () {
        "use strict";
        return !this;
    })();

    features.IS_ACTIVEX_ENABLED = (features.__IS_ACTIVEX_ENABLED = function () {
        if (typeof ActiveXObject == 'undefined') return null;
        var xmlVersions = [
      'Microsoft.XMLHTTP',
      'Msxml2.XMLHTTP.3.0',
      'Msxml2.XMLHTTP.4.0',
      'Msxml2.XMLHTTP.5.0',
      'Msxml2.XMLHTTP.6.0'
    ];
        for (var i = xmlVersions.length; i--; ) {
            try {
                if (new ActiveXObject(xmlVersions[i])) {
                    return true;
                }
            }
            catch (ex) { }
        }
        return false;
    })();

    // BUGGIES

    // Safari returns "function" as typeof HTMLCollection
    // test for typeof DOM1 `document.forms` (if exists)
    bugs.TYPEOF_NODELIST_IS_FUNCTION = (bugs.__TYPEOF_NODELIST_IS_FUNCTION = function () {
        if (document.forms) {
            return (typeof document.forms == 'function');
        }
        return null;
    })();

    // IE returns comment nodes as part of `getElementsByTagName` results
    bugs.GETELEMENTSBYTAGNAME_RETURNS_COMMENT_NODES = (bugs.__GETELEMENTSBYTAGNAME_RETURNS_COMMENT_NODES = function () {
        if (document.createElement) {
            var el = document.createElement('div');
            if (el && el.getElementsByTagName) {
                el.innerHTML = '<span>a</span><!--b-->';
                var all = el.getElementsByTagName('*');
                // IE5.5 returns a 0-length collection when calling getElementsByTagName with wildcard
                if (all.length) {
                    var lastNode = el.getElementsByTagName('*')[1];
                    var buggy = !!(lastNode && lastNode.nodeType === 8);
                    return buggy;
                }
            }
        }
        return null;
    })();

    // name attribute can not be set at run time in IE
    // http://msdn.microsoft.com/en-us/library/ms536389.aspx
    bugs.SETATTRIBUTE_IGNORES_NAME_ATTRIBUTE = (bugs.__SETATTRIBUTE_IGNORES_NAME_ATTRIBUTE = function () {
        if (document.createElement) {
            var elForm = document.createElement('form'),
          elInput = document.createElement('input'),
          root = document.documentElement;
            if (elForm &&
          elInput &&
          elInput.setAttribute &&
          elForm.appendChild &&
          root &&
          root.appendChild &&
          root.removeChild) {
                elInput.setAttribute('name', 'test');
                elForm.appendChild(elInput);
                // Older Safari (e.g. 2.0.2) populates "elements" collection only when form is within a document
                root.appendChild(elForm);
                var isBuggy = elForm.elements ? (typeof elForm.elements['test'] == 'undefined') : null;
                root.removeChild(elForm);
                return isBuggy;
            }
        }
        return null;
    })();

    bugs.ELEMENT_PROPERTIES_ARE_ATTRIBUTES = (bugs.__ELEMENT_PROPERTIES_ARE_ATTRIBUTES = function () {
        if (document.createElement) {
            var el = document.createElement('div');
            if (el && el.getAttribute) {
                el.__foo = 'bar';
                var buggy = (el.getAttribute('__foo') === 'bar');
                el = null;
                return buggy;
            }
        }
        return null;
    })();

    bugs.STRING_PROTOTYPE_REPLACE_IGNORES_FUNCTIONS = (bugs.__STRING_PROTOTYPE_REPLACE_IGNORES_FUNCTIONS = function () {
        var s = 'a';
        if (typeof s.replace == 'function') {
            return (s.replace(s, function () { return '' }).length !== 0);
        }
        return null;
    })();

    bugs.ARRAY_PROTOTYPE_CONCAT_ARGUMENTS_BUGGY = (bugs.__ARRAY_PROTOTYPE_CONCAT_ARGUMENTS_BUGGY = function () {
        return (function () {
            if (arguments instanceof Array) {
                return [].concat(arguments)[0] !== 1;
            }
            return null;
        })(1, 2);
    })();

    bugs.PROPERTIES_SHADOWING_DONTENUM_ARE_ENUMERABLE = (bugs.__PROPERTIES_SHADOWING_DONTENUM_ARE_ENUMERABLE = function () {
        for (var prop in { toString: true }) {
            return false;
        }
        return true;
    })();

    bugs.IS_REGEXP_WHITESPACE_CHARACTER_CLASS_BUGGY = (bugs.__IS_REGEXP_WHITESPACE_CHARACTER_CLASS_BUGGY = function () {
        var str = "\u0009\u000A\u000B\u000C\u000D\u0020\u00A0\u1680\u180E\u2000\u2001\u2002" +
            "\u2003\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028\u2029";
        return !/^\s+$/.test(str);
    })();

    bugs.IS_STRING_PROTOTYPE_SPLIT_REGEXP_BUGGY = (bugs.__IS_STRING_PROTOTYPE_SPLIT_REGEXP_BUGGY = function () {
        var s = 'a_b';
        if (typeof s.split == 'function') {
            return s.split(/(_)/).length !== 3;
        }
        return null;
    })();

    bugs.PRE_ELEMENTS_IGNORE_NEWLINES = (bugs.__PRE_ELEMENTS_IGNORE_NEWLINES = function () {
        if (document.createElement && document.createTextNode) {
            var el = document.createElement('pre');
            var txt = document.createTextNode('xx');
            var root = document.documentElement;
            if (el &&
          el.appendChild &&
          txt &&
          root &&
          root.appendChild &&
          root.removeChild) {
                el.appendChild(txt);
                root.appendChild(el);
                var initialHeight = el.offsetHeight;
                el.firstChild.nodeValue = 'x\nx';
                // check if `offsetHeight` changed after adding '\n' to the value
                var isIgnored = (el.offsetHeight === initialHeight);
                root.removeChild(el);
                el = txt = null;
                return isIgnored;
            }
        }
        return null;
    })();

    bugs.SELECT_ELEMENT_INNERHTML_BUGGY = (bugs.__SELECT_ELEMENT_INNERHTML_BUGGY = function () {
        if (document.createElement) {
            var el = document.createElement('select'),
          isBuggy = true;
            if (el) {
                el.innerHTML = '<option value="test">test<\/option>';
                if (el.options && el.options[0]) {
                    isBuggy = el.options[0].nodeName.toUpperCase() !== 'OPTION';
                }
                el = null;
                return isBuggy;
            }
        }
        return null;
    })();

    bugs.TABLE_ELEMENT_INNERHTML_BUGGY = (bugs.__TABLE_ELEMENT_INNERHTML_BUGGY = function () {
        if (document.createElement) {
            try {
                var el = document.createElement('table');
                if (el && el.tBodies) {
                    el.innerHTML = '<tbody><tr><td>test<\/td><\/tr><\/tbody>';
                    var isBuggy = typeof el.tBodies[0] == 'undefined';
                    el = null;
                    return isBuggy;
                }
            } catch (e) {
                return true;
            }
        }
        return null;
    })();

    bugs.SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = (bugs.__SCRIPT_ELEMENT_REJECTS_TEXTNODE_APPENDING = function () {
        if (document.createElement && document.createTextNode) {
            var s = document.createElement('script'),
          isBuggy = false;
            if (s && s.appendChild) {
                try {
                    s.appendChild(document.createTextNode(''));
                    isBuggy = !s.firstChild || (s.firstChild && s.firstChild.nodeType !== 3);
                } catch (e) {
                    return true;
                }
                s = null;
                return isBuggy;
            }
        }
        return null;
    })();

    bugs.DOCUMENT_GETELEMENTBYID_CONFUSES_IDS_WITH_NAMES = (bugs.__DOCUMENT_GETELEMENTBYID_CONFUSES_IDS_WITH_NAMES = function () {
        if (document.getElementsByTagName && document.createElement) {
            // need to feature test all these DOM methods before calling them
            var num = Number(new Date()),
          name = '__test_' + num,
          head = document.getElementsByTagName('head')[0],
          isBuggy = false,
          el;
            try {
                el = document.createElement('<input name="' + name + '">');
            } catch (e) {
                el = document.createElement('input');
                el.name = name;
            }
            if (head.appendChild && head.removeChild) {
                head.appendChild(el);
                var testElement = document.getElementById(name);
                isBuggy = !!(testElement && (testElement.nodeName.toUpperCase() === 'INPUT'));
                head.removeChild(el);
                el = null;
                return isBuggy;
            }
        }
        return null;
    })();

    bugs.DOCUMENT_GETELEMENTBYID_IGNORES_CASE = (bugs.__DOCUMENT_GETELEMENTBYID_IGNORES_CASE = function () {
        if (document.createElement && document.getElementsByTagName && document.getElementById) {
            var el = document.createElement('script'),
          head = document.getElementsByTagName('head')[0];
            if (el && head && head.appendChild && head.removeChild) {
                el.type = 'text/javascript';
                el.id = 'A';
                head.appendChild(el);
                var buggy = !!document.getElementById('a');
                head.removeChild(el);
                el = null;
                return buggy;
            }
        }
        return null;
    })();

    bugs.BUGGY_OFFSET_VALUES_FOR_STATIC_ELEMENTS_INSIDE_POSITIONED_ONES = (
  bugs.__BUGGY_OFFSET_VALUES_FOR_STATIC_ELEMENTS_INSIDE_POSITIONED_ONES = function () {
      var body = document.body,
        isBuggy = null;
      if (body &&
        body.insertBefore &&
        document.createElement &&
        document.getElementById) {
          var id = 'x' + (Math.random() + '').slice(2);
          var clearance = "margin:0;padding:0;border:0;visibility:hidden;";
          var payload = '<div style="position:absolute;top:10px;' + clearance + '">' +
        '<div style="position:relative;top:10px;' + clearance + '">' +
          '<div style="height:10px;font-size:1px;' + clearance + '"><\/div>' +
          '<div id="' + id + '">x<\/div>' +
        '<\/div>' +
      '<\/div>';
          var wrapper = document.createElement('div');
          if (wrapper) {
              wrapper.innerHTML = payload;
              body.insertBefore(wrapper, body.firstChild);
              var el = document.getElementById(id);
              if (el && el.style) {
                  if (el.offsetTop !== 10) {
                      // buggy, set position to relative and check if it fixes it
                      el.style.position = 'relative';
                      if (el.offsetTop === 10) {
                          isBuggy = true;
                      }
                  }
                  else {
                      isBuggy = false;
                  }
              }
              body.removeChild(wrapper);
          }
          wrapper = null;
      }
      return isBuggy;
  })();

    bugs.IS_XPATH_POSITION_FUNCTION_BUGGY = (
  bugs.__IS_XPATH_POSITION_FUNCTION_BUGGY = function () {
      var isBuggy = null;
      if (document.evaluate && window.XPathResult) {
          var el = document.createElement('div');
          el.innerHTML = '<p>a</p><p>b</p>'
          var xpath = ".//*[local-name()='p' or local-name()='P'][position() = 2]";
          var result = document.evaluate(xpath, el, null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
//          if (result) {
//              // TODO: investigate further
//              // alert(result.snapshotItem(0));
//          }
      }
      return isBuggy;
  })();

    bugs.IS_DOCUMENT_GETELEMENTSBYNAME_BUGGY = (
  bugs.__IS_DOCUMENT_GETELEMENTSBYNAME_BUGGY = function () {
      var isBuggy = null,
        docEl = document.documentElement;
      if (docEl &&
        docEl.appendChild &&
        docEl.removeChild &&
        document.getElementsByName &&
        document.createElement) {
          var el = document.createElement('div');
          if (el) {
              var uid = 'x' + (Math.random() + '').slice(2);
              el.id = uid;
              docEl.appendChild(el);
              isBuggy = document.getElementsByName(uid)[0] === el;
              docEl.removeChild(el);
          }
      }

      return isBuggy;
  })();

    bugs.NAMED_FUNCTION_EXPRESSION_IDENTIFIER_LEAKS_ONTO_ENCLOSING_SCOPE = (
  bugs.__NAMED_FUNCTION_EXPRESSION_IDENTIFIER_LEAKS_ONTO_ENCLOSING_SCOPE = function () {
      // make sure `g` is not found higher up the scope chain, by declaring it here
      var g = null;
      return (function () {
          var f = function g() { };
          // `g` should be resolved to `null` (the one we declared outside this function)
          // but since named function expression identifier leaks onto the enclosing scope in IE, 
          // it will be resolved to a function
          return (typeof g == 'function');
      })();
  })();

    bugs.ARGUMENTS_INSTANCEOF_ARRAY = (bugs.__ARGUMENTS_INSTANCEOF_ARRAY = function () {
        return arguments instanceof Array;
    })();

    bugs.IS_OVERFLOW_STYLE_BUGGY = (bugs.__IS_OVERFLOW_STYLE_BUGGY = function () {
        var isBuggy = null;
        if (document.createElement) {
            var el = document.createElement('div');
            el.innerHTML = '<p style="overflow: visible;">x</p>';
            var firstChild = el.firstChild;
            if (firstChild && firstChild.style) {
                firstChild.style.overflow = 'hidden';
                isBuggy = firstChild.style.overflow !== 'hidden';
            }
            el = firstChild = null;
        }
        return isBuggy;
    })();

    bugs.IS_QUERY_SELECTOR_ALL_BUGGY = (bugs.__IS_QUERY_SELECTOR_ALL_BUGGY = function () {
        var isBuggy = null;
        if (document.createElement) {
            var el = document.createElement('div');
            if (el && el.querySelectorAll) {
                el.innerHTML = '<object><param name=""></object>';
                isBuggy = el.querySelectorAll("param").length != 1;
            }
            el = null;
        }
        return isBuggy;
    })();

    __global.__totalTime = (new Date() - t);

    __global.__features = features;
    __global.__bugs = bugs;

})(this);

function selectorClick(e) {
    var inx = 1;
    var mem = [];
    for (i = 0; i < Questions.length; i++) {
        qcb = "#Question" + Questions[i].ID;
        isChecked = $(qcb)[0].checked;
        if (true === isChecked) {
            mem[inx] = "Q" + Questions[i].ID + "V1"
        }
        else {
            mem[inx] = "Q" + Questions[i].ID + "V0"
        }
        inx++;
    }

    for (i = 0; i < ExperienceLevels.length; i++) {
        ecb = "#ExperienceLevel" + ExperienceLevels[i].ID;
        isChecked = $(ecb)[0].checked;
        if (true === isChecked) {
            mem[inx] = "E" + ExperienceLevels[i].ID + "V1"
        }
        else {
            mem[inx] = "E" + ExperienceLevels[i].ID + "V0"
        }
        inx++;
    }
    $.bbq.pushState(mem);
    return true;
}
function getStateFromUrl() {
    // get the state and reset the checkboxes
    __All_Questions_Checked = true;
    __No_Questions_Checked = true;
    __All_ExperienceLevels_Checked = true;
    __No_ExperienceLevels_Checked = true;
     __Questions_CheckState = [];
    __ExperienceLevels_CheckState = [];
    qArrInx = 0;
    eArrInx = 0;
    var mem = []
    inx = 1;
    while ($.bbq.getState(inx) != null) {
        mem[inx] = $.bbq.getState(inx);
        inx++
    }
    for (i = 1; i < mem.length; i++) {
        var entry = mem[i];
        var vInx = entry.indexOf("V");
        var vVal = entry.substring(vInx + 1);
        var eLen = entry.length;
        if (entry.indexOf("Q") != -1) {
            qInx = entry.indexOf("Q");
            qNum = entry.substring(qInx + 1, vInx);
            qcb = "#Question" + qNum;
            cked = vVal === "1";
            $(qcb).attr('checked', (cked));
            __All_Questions_Checked = __All_Questions_Checked && cked;
            __No_Questions_Checked = __No_Questions_Checked && !cked;
            __Questions_CheckState[qArrInx] = {ID:qNum, IsChecked:cked}; //cked;
            qArrInx++;
        }
        else if (entry.indexOf("E") != -1) {
            eInx = entry.indexOf("E");
            eNum = entry.substring(eInx + 1, vInx);
            ecb = "#ExperienceLevel" + eNum;
            cked = (vVal === "1");
            $(ecb).attr('checked', cked);
            __All_ExperienceLevels_Checked = __All_ExperienceLevels_Checked && cked;
            __No_ExperienceLevels_Checked = __No_ExperienceLevels_Checked && !cked;
            __ExperienceLevels_CheckState[eArrInx] = { ID: eNum, IsChecked: cked };
            eArrInx++;
        }
        else {
            // somebody mucking with QueryString
            // perhaps somebody using an older version of the QueryString
            alert('DEBUG: URL contains unknown tags');
        }
    }
}


var rgba = __features.IS_RGBA_SUPPORTED;

__savedHeight = 0;

function resizeTheColorbox(height) {
    if (height > 0) {
        __savedHeight = new Number(height);
        var newHeight = __savedHeight + 50; // addition is the submit button offset

        $(".open-ideas-box").colorbox.resize({
            height: newHeight
        });
    }
}

$(function () {
    $(".open-ideas-box").colorbox({
        "inline": true,
        "href": "#wufoo-form iframe",
        "width": 500,
        "innerHeight": $("#wufoo-form iframe").height()   // Only deals with initial load
    });
});

$(document).bind('cbox_complete', function () {
    resizeTheColorbox(__savedHeight);
});


function bindEvents() {
    $(".book1Button").colorbox({ href: "/images/books/book_1_large.png" });
    $(".book2Button").colorbox({ href: "/images/books/book_2_large.png" });
    $(".book3Button").colorbox({ href: "/images/books/book_3_large.png" });
    $(".book4Button").colorbox({ href: "/images/books/book_4_large.png" });
    $(".book5Button").colorbox({ href: "/images/books/book_5_large.png" });
    $(".book6Button").colorbox({ href: "/images/books/book_6_large.png" });
    $(".book7Button").colorbox({ href: "/images/books/book_7_large.png" });
    $(".hnlinksButton").colorbox({ width: "50%", inline: true, href: "#links_explain" });
    $(".faqLink").colorbox({ width: "50%", inline: true, href: "#faqExplain" });
    //alert('a');
    if (!rgba) {
        v = $('.button-red');
        v.css("background-color", "#ff6600");
        //alert('b');
    }
}
$(document).ready(function () {
    addSortingTags();
    getStateFromUrl();
    updateDynamicContent();
    filterBooksBySelectors();
    bindEvents();
});


$(window).bind('hashchange', function (e) {
    var url = e.fragment;
    getStateFromUrl();
    filterBooksBySelectors();
    bindEvents();
});

// don't think this is needed any more
function updatePictureCache() {
    var smallPicCache = new Array(Books.length);
    var largePicCache = new Array(Books.length);
    for (i = 0; i < Books.length; i++) {
        //smallPicCache[i] = new Image();
        //smallPicCache[i].src = Books[i].SmallPictureLink;
        //largePicCache[i] = new Image();
        //largePicCache[i].src = Books[i].LargePictureLink;
    }
}
setTimeout(updatePictureCache, 1000);
