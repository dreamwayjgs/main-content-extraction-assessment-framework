chrome.devtools.panels.create('ContentExtraction', '', 'devtools/pages/panel.html', panel => {
  console.log("Devtools panel crated")
})

chrome.contextMenus.create({
  id: 'DevtoolsContext',
  title: 'Devtools Context'
})