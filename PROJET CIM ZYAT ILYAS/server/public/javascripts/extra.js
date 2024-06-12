const Print = (function() {
    function $template(opts) {
        const { lang, dir, size, margin, css, page } = opts;
        return `<!DOCTYPE html><html lang="${lang}" dir="${dir}"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible" content="IE=edge"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><style>@page{size:${size.page};margin:${margin}}#page{width:100%}#head{height:${size.head}}#foot{height:${size.foot}}</style>${css}</head><body>fzdfzfzf<table id="page"><thead><tr><td><header id="head"></header></td></tr></thead><tbody><tr><td><main id="main">${page}</main></td></tr></tbody><tfoot><tr><td><footer id=foot></footer></td></tr></tfoot></table></body></html>`;
    }

    function Print(target, { trigger = null, clear = true, exec = false } = {}) {
        const page = document.querySelector(target);

        function $callable() {
            var iframe = document.createElement("iframe");
            iframe.style.display = "none";
            document.body.appendChild(iframe);
            var iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
            iframeDoc.open();
            iframeDoc.write(
                $template({
                    ...Print.opts,
                    page: page.innerHTML,
                    css: Print.opts.css.join(""),
                })
            );
            iframeDoc.close();
            iframe.onload = function() {
                iframe.contentWindow.print();
                setTimeout(() => {
                    document.body.removeChild(iframe);
                }, 1000);
            };
        }
        clear && page.remove();
        exec && $callable();

        trigger && document.querySelectorAll(trigger).forEach((el) => el.addEventListener("click", $callable));

        return this;
    }

    Print.opts = {
        bg: "",
        css: [],
        dir: "ltr",
        lang: "en",
        size: {
            page: "A4",
            head: 0,
            foot: 0,
        },
        margin: "5mm 5mm 5mm 5mm",
    };

    return Print;
})();
