var URLHASH = new Object();
var __All_Questions_Checked = false;
var __No_Questions_Checked = true;
var __Questions_CheckState = [];

var __All_ExperienceLevels_Checked = false;
var __No_ExperienceLevels_Checked = true;
var __ExperienceLevels_CheckState = [];

var __All_Format_Checked = false;
var __No_Format_Checked = true;
var __Format_CheckState = [];

var __All_Book_Checked = false;
var __No_Book_Checked = true;
var __Book_CheckState = [];

var __PAGENEEDSSORT__ = false;
var __HASHNEEDSCOMMIT__ = false;

//var BOOKORDERING = $("#bookOrdering");
//var BOOKDRAGSOURCE = $("#bookDragSource");
//var QLISTDIV = $("#questionSelection");
//var ELISTDIV = $("#experienceLevelSelection");
//var FLISTDIV = $("#formatSelection");
//var BOOKTARGETLIST = $(".bookLargeList li");
//var RECOMMENDERNAMEINPUTTEXT = $("#recommenderName");
//var ANSWERQUESTIONLINKTEXT = $("#answerQuestionLinkText");
//var BOOKLISTSPACER = $("#bookListSpacer");

var BOOKORDERING = [];
var BOOKDRAGSOURCE = [];
var QLISTDIV = [];
var ELISTDIV = [];
var FLISTDIV = [];
//var BOOKTARGETLIST = [];
var BOOKLARGELIST = [];
var RECOMMENDERNAMEINPUTTEXT = [];
var ANSWERQUESTIONLINKTEXT = [];
var BOOKLISTSPACER = [];
function areNoFiltersSelected() { return (__No_Questions_Checked && __No_ExperienceLevels_Checked && __No_Format_Checked); }
//
// DATA
//

var Format =
      [
         { "ID": "1", "Desc": "Book" },
         { "ID": "2", "Desc": "E-Book" },
         { "ID": "3", "Desc": "AudioBook" },
         { "ID": "4", "Desc": "CD-ROM" }
      ];

//
// GENERICS
//

Array.prototype.removeByValue = function (val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) {
            this.splice(i, 1);
            break;
        }
    }
}
function idFind(arr, ID) {
    var ret = null;
    if (null == arr) return ret;
    for (i = 0; i < arr.length; i++) {
        if (arr[i].ID == ID) {
            ret = arr[i];
            break;
        }
    }
    return ret;
}
function idExists(arr, ID) {
    ret = false;
    if (null == arr) return ret;
    for (i = 0; i < arr.length; i++) {
        if (arr[i].ID == ID) {
            ret = true;
            break;
        }
    }
    return ret;
}
function numFind(arr, ID) {
    var ret = null;
    if (null == arr) return ret;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == ID) {
            ret = arr[i];
            break;
        }
    }
    return ret;
}
function numExists(arr, ID) {
    ret = false;
    if (null == arr) return ret;
    for (i = 0; i < arr.length; i++) {
        if (arr[i] == ID) {
            ret = true;
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

//
// HASH FUNCTIONS
//
function getArrayFromUrl(prefix) {
    // get the hash info, if any
    tempArr = new Array();
    count = getHashCountFromUrl(prefix) * 1;
    for (i = 0; i < count; i++) {
        var num = $.bbq.getState(prefix + i);
        tempArr.push(num);
    }
    return tempArr;
}
function makeHashChange() {
    __HASHNEEDSCOMMIT__ = false;
    $.bbq.pushState(URLHASH, 2);
}
function commitHashChange() {
    if (__HASHNEEDSCOMMIT__) {
        setTimeout(makeHashChange, 250);
    }
}
function getHashCount(prefix) {
    var count = URLHASH[prefix + 'C'];
    var tempArr = [];
    if (null == count) count = 0;
    return count
}
// sometimes you care about the url and not the DOM
function getHashCountFromUrl(prefix) {
    var count = $.bbq.getState(prefix + "C");
    if (null == count) count = 0;
    return count
}

function setHashCount(prefix, cnt) {
    var count = URLHASH[prefix + 'C'];
    if (null == count) count = 0;
    URLHASH[prefix + "C"] = cnt;
}
function doesNumberExistInHash(prefix, num) {
    var ret = false;
    count = getHashCount(prefix) * 1;
    for (i = 0; i < count; i++) {
        var hashNum = URLHASH[prefix + i] * 1;
        if (hashNum === num * 1) {
            ret = true;
            break;
        }
    }
    return ret;
}
function addToHashIfNew(prefix, num) {
    if (num === "") return;
    count = getHashCount(prefix) * 1;
    if (!doesNumberExistInHash(prefix, num)) {
        URLHASH[prefix + count] = num;
        URLHASH[prefix + "C"] = (count + 1);
        __HASHNEEDSCOMMIT__ = true;
    }
}
function compactHash(prefix) {
    var newArr = [];
    count = getHashCount(prefix) * 1;
    for (i = 0; i < count + 1; i++) {
        if (URLHASH[prefix + i]) {
            var hashNum = URLHASH[prefix + i] * 1;
            newArr.push(hashNum);
            setArrayToHash(prefix, newArr);
        }
    }
}
function removeFromHash(prefix, num) {
    if (num === "") return;
    count = getHashCount(prefix) * 1;
    if (doesNumberExistInHash(prefix, num * 1)) {
        for (i = 0; i < count; i++) {
            var hashNum = URLHASH[prefix + i] * 1;
            if (hashNum === num * 1) {
                delete URLHASH[prefix + i];
                URLHASH[prefix + "C"] = (count - 1);
                __HASHNEEDSCOMMIT__ = true;
                break;
            }
        }
        compactHash(prefix);
    }
}
function getArrayFromHash(prefix) {
    // get the hash info, if any
    tempArr = new Array();
    count = getHashCount(prefix) * 1;
    for (i = 0; i < count; i++) {
        var num = URLHASH[prefix + i];
        tempArr.push(num);
    }
    return tempArr;
}
function removeAllArrayFromHash(prefix) {
    var tempArr = getArrayFromHash(prefix);
    var count = tempArr.length;
    for (i = 0; i < count; i++) {
        delete URLHASH[prefix + i];
    }
    setHashCount(prefix, 0);
    __HASHNEEDSCOMMIT__ = true;
}
function setArrayToHash(prefix, arr) {
    removeAllArrayFromHash(prefix);
    $(arr).each(function (i) {
        addToHashIfNew(prefix, arr[i]);
    });
}
function urlToLocalHash(arr) {
    $(arr).each(function (i) {
        var tempArr = getArrayFromUrl(this);
        setArrayToHash(this, tempArr);
    });
}

function setNameInHash(name) {
    if (null == name) return;
    URLHASH["Name"] = name;
    __HASHNEEDSCOMMIT__ = true;
}
function getNameFromHash(name) {
    var temp = URLHASH["Name"];
    if (null == temp) temp = "";
    return decodeURI(temp);
}
function getNameFromUrl(name) {
    var temp = $.bbq.getState("Name");
    if (null == temp) temp = "";
    return decodeURI(temp);
}
function getBookHashArray() {
    var ret = [];
    ret = getArrayFromHash("B");
    return ret;
}
function removeAllBooksSelectedListFromHash() {
    removeAllArrayFromHash("B");
}
function idExistsInHash(prefix, id) {
    var ret = false;
    var tempArr = getArrayFromHash(prefix);
    ret = numExists(tempArr, id);
    return ret;
}
//
// BUSINESS QUESTIONS
//
function isQuestionIDChecked(qID) {
    var ret = false;
    idExistsInHash("Q", qID);
    return ret;
}
function isExperienceLevelsIDChecked(qID) {
    var ret = false;
    idExistsInHash("E", qID);
    return ret;
}
function isFormatIDChecked(qID) {
    var ret = false;
    ret = idExistsInHash("F", qID);
    return ret;
}
function isBookIDChecked(qID) {
    var ret = false;
    idExistsInHash("B", qID);
    return ret;
}
function bookContainsFormatID(book, qID) {
    ret = false;
    for (i = 0; i < book.wPurchaseInfo.length; i++) {
        bookFormatID = formatIDFromDesc(book.wPurchaseInfo[i].Format);
        if (bookFormatID === qID) {
            ret = true;
            break;
        }
    }
    return ret;
}
function bookFormatMatchesASelectedFormat(book, matchType) {
    if (__All_Format_Checked || __No_Format_Checked) return true;
    var ret = false;
    if (matchType === "AND") ret = true;
    var pi = book.wPurchaseInfo;
    $(pi).each(function (n) {
        var bookFormatID = pi[n].FormatID;
        var formatMatch = isFormatIDChecked(bookFormatID);
        if (formatMatch) {
            // format match, type OR - set master return to true and bail out of loop
            if (matchType === "OR") {
                ret = true;
            }
            // format match, type AND. Don't know yet. AND the values and keep going
            else {
                ret = ret && true;
            }
        }
        else {
            // no format match, type AND. We know it won't work. Set master return to false and bail out of loop
            if (matchType === "AND") {
                ret = false;
            }
            // no format match, but type is OR, so we don't know yet. OR the current result and keep going
            else {
                ret = ret || false;
            }
        }
    });
    return ret;
}
function doesBookAnswerThisQuestionID(book, qid) {
    var ret = false;
    for (k = 0; k < book.QuestionsAnswered.length; k++) {
        if (book.QuestionsAnswered[k].QuestionID == qid) {
            ret = true;
            break;
        }
    }
    return ret;
}
function doesBookAnswerAnySelectedQuestion(book) {
    if (__All_Questions_Checked || __No_Questions_Checked) return true;
    var ret = false;
    for (j = 0; j < book.QuestionsAnswered.length; j++) {
        questSelected = isQuestionIDChecked(Questions[j].ID);
        if (true === questSelected) {
            ret = true;
            break;
        }
    }
    return ret;
}
function doesBookAnswerAllOfTheSelectedQuestions(book) {
    if (__All_Questions_Checked || __No_Questions_Checked) return true;
    var ret = true;
    var selectedQuestions = getArrayFromHash("Q");
    if (!__All_Questions_Checked) {
        for (j = 0; j < selectedQuestions.length; j++) {
            bookAnswersTheQuestion = doesBookAnswerThisQuestionID(book, selectedQuestions[j]);
            if (!bookAnswersTheQuestion) {
                ret = false;
                break;
            }
        }
    }
    return ret;
}

//
// TEMPLATES
//
function completeQuestionTemplateAndAppend(question, parentDiv) {
    var qTemplate = "<li id=\"Question###QUESTIONID###\" class=\"ui-widget-content\"><div class=\"questionWidget\"><div class=\"span-1\"><input type=\"checkbox\" id=\"cbQuestion###QUESTIONID###\" onclick=\"{toggleSelectable(\'#Question###QUESTIONID###\'); updateHashFromQuestionList()};\"/></div><div class=\"span-5 last\">#######</div></div></li>";
    var quest = question.Desc;
    var tempWithQUESTIONID = qTemplate.replace(/###QUESTIONID###/g, question.ID);
    var filledTemplate = tempWithQUESTIONID.replace("#######", quest);
    parentDiv.append(filledTemplate);
}
function completeExperienceLevelTemplateAndAppend(experienceLevel, parentDiv) {
    var eTemplate = "<li id=\"ExperienceLevel###EXPERIENCELEVELID###\" class=\"ui-widget-content\"><div class=\"experienceLevelWidget\"><div class=\"span-1\"><input type=\"checkbox\" id=\"cbExperienceLevel###EXPERIENCELEVELID###\" onclick=\"{toggleSelectable(\'#ExperienceLevel###EXPERIENCELEVELID###\'); updateHashFromExperienceLevelList()};\"/></div><div class=\"span-5 last\">#######</div></div></li>";
    var expDesc = experienceLevel.Desc;
    var tempWithEXPERIENCELEVELID = eTemplate.replace(/###EXPERIENCELEVELID###/g, experienceLevel.ID);
    var filledTemplate = tempWithEXPERIENCELEVELID.replace("#######", expDesc);
    parentDiv.append(filledTemplate);
}
function completeFormatTemplateAndAppend(format, parentDiv) {
    var eTemplate = "<li id=\"Format###FORMATID###\" class=\"ui-widget-content\"><div class=\"formatWidget\"><div class=\"span-1\"><input type=\"checkbox\" id=\"cbFormat###FORMATID###\" onclick=\"{toggleSelectable(\'#Format###FORMATID###\'); updateHashFromFormatList()};\"/></div><div class=\"span-5 last\">#######</div></div></li>";
    var formatDesc = format.Desc;
    var tempWithID = eTemplate.replace(/###FORMATID###/g, format.ID);
    var filledTemplate = tempWithID.replace("#######", formatDesc);
    parentDiv.append(filledTemplate);
}
function completeLargeBookTemplateAndAppend(book, parentDiv) {
    var bookListTemplate = "<li class=\"ui-widget-content\"><a name=\"N###BOOKNUMBER###\"></a><div class=\"bookWidgetLarge\"><div class=\"bookWidgetLargeImageBox\"><a href=\"#$#BOOKDETAILLINK#$#\"><img src=\"#$#SMALLPICTURELINK#$#\" alt=\"###BOOKTITLE###\" /></a><button class=\"book###BOOKNUMBER###Button\">Zoom</button></div><div class=\"\"><a href=\"#$#BOOKDETAILLINK#$#\"><h3>###BOOKTITLE###</h3><h4>#$#SUBTITLE#$#</h4></a>#$#HTMLDESCRIPTION#$#</div><div class=\"bookWidgetLargeBottomBar\">";
    var formatPurchaseLinkTemplate = "<button><a href=\"#$#PURCHASELINK#$#\">#$#FORMATNAME#$#</a></button> ";
    bookListTemplate += "#$#FORMATPURCHASELINK#$#";
    bookListTemplate += "</div></div></li>";

    var tempWithTitle = bookListTemplate.replace(/###BOOKTITLE###/g, book.Title);
    var tempWithDetailLink = tempWithTitle.replace(/#\$#BOOKDETAILLINK#\$#/g, ("http://www.hn-books.com/Books/" + book.WebName + ".htm"));
    var tempWithSubTitle = tempWithDetailLink.replace(/#\$#SUBTITLE#\$#/g, book.SubTitle);
    var tempWithSmallPic = tempWithSubTitle.replace("#$#SMALLPICTURELINK#$#", book.SmallPictureLink);
    var tempWithHtmlDescription = tempWithSmallPic.replace("#$#HTMLDESCRIPTION#$#", book.HtmlDescription);
    var bookNumber = book.ID;  //j+1;
    var tempWithBookNum = tempWithHtmlDescription.replace(/###BOOKNUMBER###/g, bookNumber);
    var purcLinks = "";
    var purcArrayLen = book.wPurchaseInfo.length;
    for (i = 0; i < purcArrayLen; i++) {
        n1 = formatPurchaseLinkTemplate.replace(/#\$#PURCHASELINK#\$#/g, book.wPurchaseInfo[i].PurchaseLink);
        n2 = n1.replace(/#\$#FORMATNAME#\$#/g, book.wPurchaseInfo[i].Format);
        purcLinks += n2;
    }

    tempWithButtons = tempWithBookNum.replace("#$#FORMATPURCHASELINK#$#", purcLinks);
    parentDiv.append(tempWithButtons);
    // hook up zoom button
    var buttonClassName = ".book" + bookNumber + "Button";
    $(buttonClassName).colorbox({ href: book.LargePictureLink });
}
function completeSmallBookTemplateAndAppend(book, parentDiv) {
    var eTemplate = "<li class=\"ui-widget-content\" id=\"Book#$#BOOKID#$#\"><div class=\"bookWidgetSmall\"><img src=\"#$#SMALLPICTURELINK#$#\" alt=\"Book cover: ###BOOKTITLE###\" /><div class=\"bookTitle\">###BOOKTITLE###</div></div></li>";
    var tempWithTitle = eTemplate.replace(/###BOOKTITLE###/g, book.Title);
    var tempWithSmallPic = tempWithTitle.replace(/#\$#SMALLPICTURELINK#\$#/g, book.SmallPictureLink);
    var tempWithBookID = tempWithSmallPic.replace(/#\$#BOOKID#\$#/g, book.ID);
    parentDiv.append(tempWithBookID);
}

//
// SORT/FILTER
//

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
function bookMatchWithSelectors(book, index, array) {
    var ret = false;
    if (SELECTOR_MATCH_TYPE === "OR") {
        bookAnswersOneOfTheSelectedQuestions = doesBookAnswerAnySelectedQuestion(book)
        formatMatch = bookFormatMatchesASelectedFormat(book, SELECTOR_MATCH_TYPE);
        ret = bookAnswersOneOfTheSelectedQuestions && formatMatch;
    }
    else if (SELECTOR_MATCH_TYPE === "AND") {
        bookAnswersAllOfTheSelectedQuestions = doesBookAnswerAllOfTheSelectedQuestions(book)
        //bookAnswersAllOfTheSelectedQuestions = true;
        formatMatch = bookFormatMatchesASelectedFormat(book, "OR");
        ret = bookAnswersAllOfTheSelectedQuestions && formatMatch;
    }
    return ret;
}
function bookFilter(input) {
    temp = input.slice();
    // if none of the checkboxes are checked, return everything
    if (__All_Questions_Checked && __All_Format_Checked) {
        ret = temp;
    }
    else {
        try {
            ret = temp.filter(bookMatchWithSelectors);
        }
        catch (e) {
            ret = filterArray(temp, bookMatchWithSelectors);
        }
    }
    return ret;
}
function filterBooksBySelectors() {
    BOOKORDERING.children().remove();
    //$("#bookOrdering").children().remove();
    var newBooks = bookFilter(Books);
    var newFilteredBooks = newBooks.sort(bookSort);
    zapBookListInDOM();
    addBookArrayToDOM(newBooks);
}

jQuery.fn.fadeThenSlideToggle = function (speed, easing, callback) {
    if (this.is(":hidden")) {
        return this.slideDown(speed, easing).fadeTo(speed, 1, easing, callback);
    } else {
        return this.fadeTo(speed, 0, easing).slideUp(speed, easing, callback);
    }
};

//
// STARTUP/DOM MANIPULATION
//
function onPageWithManualUserBookSorting() {
    return BOOKDRAGSOURCE.length != 0;
    //return $("#bookDragSource").length != 0;
}
function addStaticDOMContent() {
    $(Questions).each(function (i) { completeQuestionTemplateAndAppend(Questions[i], QLISTDIV); });

    $(ExperienceLevels).each(function (i) { completeExperienceLevelTemplateAndAppend(ExperienceLevels[i], ELISTDIV); });

    $(Format).each(function (i) { completeFormatTemplateAndAppend(Format[i], FLISTDIV); });
}

function zapBookListInDOM() {
    BOOKLARGELIST.find("li").fadeThenSlideToggle().remove();
    //$(".bookLargeList li").fadeThenSlideToggle().remove();
}

function addBookArrayToDOM(bookArray) {
    var bookListOL = $(".bookLargeList");
    // if we don't have a list, no point in stuffing it
    if (bookListOL.length == 0) return;
    bookListOL.hide();
    // is this a full load or a selected load?
    if (areThereBooksInUrl()) {
        var hashArr = getArrayFromUrl("B");
        $(hashArr).each(function (i) {
            var book = idFind(bookArray, hashArr[i]);
            completeLargeBookTemplateAndAppend(book, bookListOL);
        });
    }
    else {
        $(bookArray).each(function (i) { completeLargeBookTemplateAndAppend(bookArray[i], bookListOL); });
    }
    bookListOL.show();
}

function areThereBooksInHash() {
    var ret = false;
    ret = getHashCount("B");
    return (ret != 0);
}
function areThereBooksInUrl() {
    var ret = false;
    ret = getHashCountFromUrl("B");
    return (ret != 0);
}
function doesHashMatchOrderedBox() {
    // when checking here, the hash perhaps has changed, so the DOM needs
    // to catch up. We cannot use URLHASH, as it reflects the DOM and not the
    // actual hash
    var ret = true;
    var hashCount = getHashCountFromUrl("B");
    //var orderedBooks = $("#bookOrdering  li");
    var orderedBooks = BOOKORDERING.find("li");
    var bookArray = getArrayFromUrl("B");
    if (orderedBooks.length != bookArray.length) return false;
    $(bookArray).each(function (i) {
        if (("Book" + bookArray[i]) != orderedBooks[i].id) {
            ret = false;
            return false;
        }
    });
    return ret;
}
function alphabetical(a, b) {
    var A = a.toLowerCase();
    var B = b.toLowerCase();
    if (A < B) {
        return -1;
    } else if (A > B) {
        return 1;
    } else {
        return 0;
    }
}
function sortByTitle(a, b) {
    return alphabetical(a.Title, b.Title);
}
function fillBookSelectionBoxes(hashArr) {
    //var bls = $('#bookDragSource');
    var bls = BOOKDRAGSOURCE;
    //var bOrd = $("#bookOrdering");
    var bOrd = BOOKORDERING;
    bls.hide();
    bls.find('li').remove();
    bOrd.hide();
    bOrd.find('li').remove();
    //var hashArr = getBookHashArray();
    var booksByTitle = (Books.slice()).sort(sortByTitle);
    $(booksByTitle).each(function (i) {
        if (numExists(hashArr, this.ID)) {
            // do nothing. It's in the other list
        } else {
            completeSmallBookTemplateAndAppend(this, bls);
        }
    });
    $(hashArr).each(function (i) {
        tempBook = idFind(Books, hashArr[i])
        completeSmallBookTemplateAndAppend(tempBook, bOrd);
    });
    bls.show();
    bOrd.show();
}

function areThereBooksInSorter() {
    //return $("#bookOrdering  li").length;
    return BOOKORDERING.find("li").length;
}
function displayHashSelectedBooksInLargeFormat() {
    var hashArr = getArrayFromHash("B");
    var bookListOL = $(".bookLargeList");
    bookListOL.hide();
    bookListOL.children().remove();
    $(hashArr).each(function (i) {
        tempBook = idFind(Books, hashArr[i]);
        completeLargeBookTemplateAndAppend(tempBook, bookListOL);
    });
    updateLinkText();
    bookListOL.show();
}

function getLinkText() {
    var ret = "";
    var h = document.URL.split("//"); // split at protocol
    var g = h[1].split("#");
    if (null == g[1]) {
        ret = "";
    } else {
        ret = "http://www.hn-books.com" + "#" + g[1];
    }
    return ret;
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
        $(".askLink").colorbox.resize({
            height: newHeight
        });
    }
}


function syncSelectedWithHashAddNew(thisVar, tokenLength, tokenLetter) {
    var qid = (thisVar.id).substring(tokenLength, (thisVar.id).length);
    addToHashIfNew(tokenLetter, qid);
}
function syncSelectedWithHashRemoveOld(thisVar, tokenLength, tokenLetter) {
    var qid = (thisVar.id).substring(tokenLength, (thisVar.id).length);
    removeFromHash(tokenLetter, qid);
}

function bindEvents() {
    $(".faqLink").colorbox({ width: "50%", inline: true, href: "#faqExplain" });
    //alert('a');
    if (!rgba) {
        v = $('.button-red');
        v.css("background-color", "#ff6600");
        //alert('b');
    }
    $("img").lazyload({ threshold: 500 });
}

function updateLinkText() {
    if (RECOMMENDERNAMEINPUTTEXT.length == 0) return;
    //if ($("#recommenderName").length == 0) return;
    var name = $(RECOMMENDERNAMEINPUTTEXT)[0].value;
    var urltxt = getLinkText();
    if ((null == urltxt) || (urltxt == "")) return;
    if ((null == name) || (name == "")) {
        ANSWERQUESTIONLINKTEXT.text(urltxt);
    }
    else {
        ANSWERQUESTIONLINKTEXT.text(urltxt + "&Name=" + encodeURI(name));
    }
}



function sortPage() {
    __PAGENEEDSSORT__ = true;
    setTimeout(performSortPage, 1500);

}
function performSortPage() {
    if (__PAGENEEDSSORT__) {
        __PAGENEEDSSORT__ = false;
        filterBooksBySelectors();
        bindEvents();
    }
}
function setCheckedValForID(arr, id, ckVal) {
    for (i = 0; id < arr.length; i++) {
        if (arr[i].ID == id) {
            arr[i].IsChecked = ckVal;
            break;
        }
    }
}
function syncSelectorsWithState() {
    QLISTDIV.find("li").each(function (i) {
        var tid = this.id;
        var bid = tid.substring(8, tid.length);
        var questState = idFind(__Questions_CheckState, bid);
        if (questState.IsChecked) {
            $(this).addClass("ui-selected");
            $('#cbQuestion' + bid).attr('checked', true);
        } else {
            $(this).removeClass("ui-selected");
            $('#cbQuestion' + bid).attr('checked', false);
        }
    });
    ELISTDIV.find("li").each(function (i) {
        var tid = this.id;
        var bid = tid.substring(15, tid.length);
        var questState = idFind(__ExperienceLevels_CheckState, bid);
        if (questState.IsChecked) {
            $(this).addClass("ui-selected");
            $('#cbExperienceLevel' + bid).attr('checked', true);
        } else {
            $(this).removeClass("ui-selected");
            $('#cbExperienceLevel' + bid).attr('checked', false);
        }
    });
    FLISTDIV.find("li").each(function (i) {
        var tid = this.id;
        var bid = tid.substring(6, tid.length);
        var questState = idFind(__Format_CheckState, bid);
        if (questState.IsChecked) {
            $(this).addClass("ui-selected");
            $('#cbFormat' + bid).attr('checked', true);
        } else {
            $(this).removeClass("ui-selected");
            $('#cbFormat' + bid).attr('checked', false);
        }
    });
}
function displaySmallBookList() {
    fillBookSelectionBoxes(getBookHashArray());
}
function displayLargeBookList() {
    $('#loading').show();
    if (areThereBooksInHash()) {
        displayHashSelectedBooksInLargeFormat();
    }
    else if (areNoFiltersSelected()) {
        zapBookListInDOM();
        addBookArrayToDOM(Books);
        sortPage();
    }
    else {
        sortPage();
    }
    $('#loading').hide();
}

function syncPageWithState() {
    updateLinkText();
    // if there's a name in the url, append it to the doc
    var n = getNameFromUrl();
    if ("" === n) {
        BOOKLISTSPACER.find("h1").remove();
        BOOKLISTSPACER.css("height", "1px");
    } else {
        BOOKLISTSPACER.append("<h1> Recommendations from " + getNameFromUrl() + "</h1>");
        BOOKLISTSPACER.css("height", "2.25em");
    }
    syncSelectorsWithState();
    var onManualBookSortPage = onPageWithManualUserBookSorting();
    if (onManualBookSortPage) {
        displaySmallBookList();
    }
    else {
        displayLargeBookList();
    }
    bindEvents();
}
function getStateFromUrl() {
    // get the state and reset the checkboxes
    __All_Questions_Checked = true;
    __No_Questions_Checked = true;
    __Questions_CheckState = [];

    __All_Format_Checked = true;
    __No_Format_Checked = true;
    __Format_CheckState = [];

    __All_Books_Checked = true;
    __No_Books_Checked = true;
    __Books_CheckState = [];

    __All_ExperienceLevels_Checked = true;
    __No_ExperienceLevels_Checked = true;
    __ExperienceLevels_CheckState = [];

    qArrInx = 0;
    eArrInx = 0;

    var hashQuests = getArrayFromHash("Q");
    if (hashQuests.length === Questions.length) { __All_Questions_Checked = true; } else { __All_Questions_Checked = false; }
    if (hashQuests.length === 0) { __No_Questions_Checked = true; } else { __No_Questions_Checked = false; }
    __Questions_CheckState = [];
    $(Questions).each(function (i) {
        __Questions_CheckState[i] = { ID: Questions[i].ID, IsChecked: false }
    });
    $(hashQuests).each(function (i) {
        setCheckedValForID(__Questions_CheckState, hashQuests[i] * 1, true);
    });


    var hashELs = getArrayFromHash("E");
    if (hashELs.length === ExperienceLevels.length) { __All_ExperienceLevels_Checked = true; } else { __All_ExperienceLevels_Checked = false; }
    if (hashELs.length === 0) { __No_ExperienceLevels_Checked = true; } else { __No_ExperienceLevels_Checked = false; }
    __ExperienceLevels_CheckState = [];
    $(ExperienceLevels).each(function (i) {
        __ExperienceLevels_CheckState[i] = { ID: ExperienceLevels[i].ID, IsChecked: false }
    });
    $(hashELs).each(function (i) {
        setCheckedValForID(__ExperienceLevels_CheckState, hashELs[i] * 1, true);
    });


    var hashELs = getArrayFromHash("F");
    if (hashELs.length === Format.length) { __All_Format_Checked = true; } else { __All_Format_Checked = false; }
    if (hashELs.length === 0) { __No_Format_Checked = true; } else { __No_Format_Checked = false; }
    __Format_CheckState = [];
    $(Format).each(function (i) {
        __Format_CheckState[i] = { ID: Format[i].ID, IsChecked: false }
    });
    $(hashELs).each(function (i) {
        setCheckedValForID(__Format_CheckState, hashELs[i] * 1, true);
    });

    var hashELs = getArrayFromHash("B");
    if (hashELs.length === Books.length) { __All_Books_Checked = true; } else { __All_Books_Checked = false; }
    if (hashELs.length === 0) { __No_Books_Checked = true; } else { __No_Books_Checked = false; }
    __Books_CheckState = [];
    $(Books).each(function (i) {
        __Books_CheckState[i] = { ID: Books[i].ID, IsChecked: false }
    });
    $(hashELs).each(function (i) {
        setCheckedValForID(__Books_CheckState, hashELs[i] * 1, true);
    });
}


$(window).bind('hashchange', function (e) {
    var url = e.fragment;
    urlToLocalHash(["Q", "F", "E", "B"]);
    getStateFromUrl();
    syncPageWithState();
});
function toggleSelectable(itemID) {
    var item = $(itemID);
    if (item.not(".ui-selected").length > 0) {
        item.addClass("ui-selected");
    } else {
        item.removeClass("ui-selected");
    }
}
function updateHashFromQuestionList() {
    if (!BOOKDRAGSOURCE.length) {
        removeAllBooksSelectedListFromHash();
    }
    QLISTDIV.find("li", this).not(".ui-selected").each(function () {
        var qid = (this.id).substring(8, (this.id).length);
        removeFromHash("Q", qid);
        $('#cbQuestion' + qid).attr('checked', false);
    })
    QLISTDIV.find(".ui-selected", this).each(function () {
        var qid = (this.id).substring(8, (this.id).length);
        addToHashIfNew("Q", qid);
        $('#cbQuestion' + qid).attr('checked', true);
    })
    commitHashChange();
}
function updateHashFromExperienceLevelList() {
    if (!BOOKDRAGSOURCE.length) {
        removeAllBooksSelectedListFromHash();
    }
    ELISTDIV.find("li", this).not(".ui-selected").each(function () {
        syncSelectedWithHashRemoveOld(this, 15, 'E');
    })
    ELISTDIV.find(".ui-selected", this).each(function () {
        syncSelectedWithHashAddNew(this, 15, 'E');
    })
    commitHashChange();
}
function updateHashFromFormatList() {
    if (!BOOKDRAGSOURCE.length) {
        removeAllBooksSelectedListFromHash();
    }
    FLISTDIV.find("li", this).not(".ui-selected").each(function () {
        syncSelectedWithHashRemoveOld(this, 6, 'F');
    })
    FLISTDIV.find(".ui-selected", this).each(function () {
        syncSelectedWithHashAddNew(this, 6, 'F');
    })
    commitHashChange();
}
$(document).ready(function () {
    BOOKORDERING = $("#bookOrdering");
    BOOKDRAGSOURCE = $("#bookDragSource");
    QLISTDIV = $("#questionSelection");
    ELISTDIV = $("#experienceLevelSelection");
    FLISTDIV = $("#formatSelection");
    BOOKLARGELIST = $(".bookLargeList");
    RECOMMENDERNAMEINPUTTEXT = $("#recommenderName");
    ANSWERQUESTIONLINKTEXT = $("#answerQuestionLinkText");
    BOOKLISTSPACER = $("#bookListSpacer");

    urlToLocalHash(["Q", "F", "E", "B"]);
    addStaticDOMContent();
    getStateFromUrl();
    syncPageWithState();

    ELISTDIV.selectable({
        stop: function () {
            updateHashFromExperienceLevelList();
        }
    });
    QLISTDIV.selectable({
        stop: function () {
            updateHashFromQuestionList();
        }
    });
    FLISTDIV.selectable({
        stop: function () {
            updateHashFromFormatList();
        }
    });
    $("#bookDragSource, #bookOrdering").sortable({
        connectWith:
                '.bookLinkedList',
        update: function (event, ui) {
            //var divs = $("#bookOrdering  li");
            var divs = BOOKORDERING.find("li");
            var tempArr = [];
            $(divs).each(function (i) {
                bid = this.id;
                bookID = bid.substring(4, bid.length);
                tempArr.push(bookID);
            });
            setArrayToHash("B", tempArr);
            commitHashChange();
        }
    }).disableSelection();
    RECOMMENDERNAMEINPUTTEXT.change(function () {
        updateLinkText();
    });
    RECOMMENDERNAMEINPUTTEXT.keyup(function () {
        updateLinkText();
    });
    //setup wufoo boxes
    $(function () {
        $(".open-ideas-box").colorbox({
            "inline": true,
            "href": "#wufoo-form-ideas iframe",
            "width": 500,
            "innerHeight": $("#wufoo-form iframe").height()   // Only deals with initial load
        });
    });
    $(function () {
        $(".askLink").colorbox({
            "inline": true,
            "href": "#wufoo-form-askaquestion iframe",
            "width": 500,
            "innerHeight": $("#wufoo-form iframe").height()   // Only deals with initial load
        });
    });
    $(document).bind('cbox_complete', function () {
        resizeTheColorbox(__savedHeight);
    });
});
