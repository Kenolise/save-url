'use strict'

let urls = '';
chrome.extension.isAllowedIncognitoAccess(isAllowedAccess);

document.addEventListener('DOMContentLoaded', function () {
    let copyBtn = document.getElementById('copyUrls');
    let includeIncognito = document.getElementById('includeIncognito');
    copyBtn.addEventListener('click', function () {
        urls = '';
        loadWindowList(includeIncognito.checked);
    });
});

function copyTextToClipboard(text) {
    navigator.clipboard.writeText(text).then(function () {
        appendToLog('URL of open tabs copied to clipboard successfully!');
    }, function (err) {
        appendToLog('Could not copy URLs: ' + err);
    });
}

function loadWindowList(includeIncognito) {
    chrome.windows.getAll({ populate: true }, function (windowList) {
        for (let i = 0; i < windowList.length; i++) {
            for (let j = 0; j < windowList[i].tabs.length; j++) {
                if (includeIncognito)
                    urls += windowList[i].tabs[j].url + '\n';
                else {
                    !windowList[i].tabs[j].incognito ?
                        (urls += windowList[i].tabs[j].url + '\n') : "";
                }
            }
        }
        copyTextToClipboard(urls);
    });
}

function appendToLog(logLine) {
    document.getElementById('log')
        .appendChild(document.createElement('p'))
        .innerText = logLine;
}

function isAllowedAccess(allowed) {
    !allowed ? document.getElementsByClassName('checkbox')[0].style.visibility = 'hidden' : '';
    !allowed ? appendToLog('To allow in "Incognito mode", go to "Extensions->Copy Tabs->Details and enable "Allow in private"') : '';
}
