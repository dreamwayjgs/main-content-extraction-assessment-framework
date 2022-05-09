# Main content extraction Framework
 A WebExtension based framework for the assessment of Main Content Extraction Methods from web pages. This framework provides four steps to assess the main content extraction methods:
   1. Crawling web pages
   1. Curation: Annotating and labeling web pages.
   1. Extraction: Run the main content extraction methods on the web pages.
   1. Evaluation: Evaluate the extraction result by comparing with the ground truth.


# Instructions
1. Install dependencies
```
yarn
```
2. build the extension (unpacked extension created in <code>dist</code> folder)
```
yarn build
```
3. Watch code (unpacked extension created in <code>dist</code> folder continuously)
```
yarn watch
```

## Install extension
Select <code>dist</code> folder when [load an unpacked extension.](https://developer.chrome.com/docs/extensions/mv3/getstarted/#unpacked)
