# kommentator
Open source comment system static websites deserve!

### Why kommentator exist

The project started when I moved my personal blog to [Hugo](http://gohugo.io) and realised that I want some interactivity and engagement with my readers. I started looking at different options for hosting comments and did not like any of them for different reasons. You can read more about why I decided new system is needed [here](https://binarybuffer.com/post/2017/09-open-source-comment-system/). And leave the comment!

### Features

* Single-no dependency binary. Just download binary and run
* Small footprint on the page. Currently it only adds 6kb gzipped js to the page
* Social interaction with like/dislike buttons
* RECAPTCHA on-demand support. Recaptcha JS are loaded only when user actually tries to submit a comment


### Current status

It is in quite early developement but it is already running at [my blog](https://binarybuffer.com). Until first "production"-ready release expect it to be backward incompatible. You are still more than welcome to use it and raise issue in case of any problems

### Usage

1. Go to [releases](https://github.com/kenota/kommentator/releases) page and download latest binary for your target platform
1. Currently, kommentator need to have reverse-proxy to terminate https traffic. If you plan to access it over HTTP, you do not need proxy
1. Decide on domain where you going to access comment system. Lets say `k.myblog.com` while your blog is `myblog.com`
1. Start commentator using following command: `./kommentator -u https://myblog.com` The url you pass will be whitelested in CORS headers so your page will be able to communicate with kommentator.
1. On your website, add following script:
    ```html
    <script defer src="//k.myblog.com/dist/bundle.js"></script>
    ```
    Then, on the page where you want to add comments you need to place a div
    ```html
    <div class="k-comments" data-k-server="https://k.myblog.com/" data-k-uri="https://myblog.com/my-post" />
    ```
    Parameters are:
    * `data-k-server` - the url to server running kommentator
    * `data-k-uri` - uri of this comment threads. All comment threads are binded to some uri.

    You can style your div to take whatever width you like, comments will try to take 100% of the div.

Enjoy.