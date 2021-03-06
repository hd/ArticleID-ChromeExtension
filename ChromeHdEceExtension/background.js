/*
 * ChromeHdEceExtension background.js
 *
 * Holds the article data for all tabs and listens for events from the doc_start.js
 *
 * This is also the script responsible for puting the extension icon into the
 * address-bar of Chrome (by calling chrome.pageAction.show(...)).
 *
 * David Tiselius <david.tiselius@hd.se>
 */
/**
 * Holder of data for each tab using the tab-id as keys.
 * The popup.html then uses this map to render the article
 * meta-data list.
 */
var tabData = {};

chrome.extension.onMessage.addListener(function(request, sender) {

    if (request.msg === "articleDocument") {
      /*
       * We have received a map of article meta-data found on the page.
       * Enable the page action icon.
       */
      tabData[sender.tab.id] = request.articleData;
      chrome.pageAction.setTitle(
        {tabId: sender.tab.id,
         title: 'Klicka för att se data för "' + request.articleData.title + '"'
        }
      );
      chrome.pageAction.setIcon(
          {tabId: sender.tab.id,
           path: "browseraction.png"}
      );
      chrome.pageAction.show(sender.tab.id);


    } else {
      delete tabData[sender.tab.id]; //if previously loaded with article
      chrome.pageAction.setTitle(
        {tabId: sender.tab.id,
         title: 'Ingen artikeldata'}
      );
      chrome.pageAction.setIcon(
          {tabId: sender.tab.id,
           path: "browseraction-inact.png"}
      );
      chrome.pageAction.show(sender.tab.id);
    }
  });

  /*
   * Delete the article data associated with tab if it's closed
   */
  chrome.tabs.onRemoved.addListener(function(tabId) {
    delete tabData[tabId];
  });
