// Copyright 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

var options = {};
console.profile("Extraction");
var res = org.chromium.distiller.DomDistiller.applyWithOptions(options);
console.profileEnd("Extraction");
console.log(res)
// document.head.innerHTML = "<title>" + res[1] + "</title>";
// document.body.innerHTML = "<h1>" + res[1] + "</h1>" + res[2][1];

chrome.runtime.sendMessage({
  work: 'extraction',
  name: 'dom-distiller',
  status: 'done',
  data: {
    title: res[1],
    body: res[2][1],
    raw: res
  }
})