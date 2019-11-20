let visit = require("unist-util-visit");
const plantumlEncoder = require("plantuml-encoder");

const PLUGIN_NAME = "remark-plantuml";

function plantuml(options = {}) {
    options.url = options.url || "http://www.plantuml.com/plantuml/";
    options.format = options.format || "png";
    options.base_path = options.base_path || "";
    options.inline_type = options.inline_type || "plantuml";

    const throwOnError = options.throwOnError || false;

    return function transformer(ast, vFile, next) {
        visitCodeBlock(ast, vFile, options);
        if (typeof next === "function") {
            return next(null, ast, vFile);
        } else {
            return ast;
        }
    };
}

function visitCodeBlock(ast, vFile, options) {
    return visit(ast, "code", (node, index, parent) => {
        let { lang, value, position } = node;

        if (lang !== options.inline_type) {
            return node;
        }

        const baseUrl = options.url + options.format + "/";
        const encoded = plantumlEncoder.encode(value);

        plantumlEncoder.title;

        let image = {
            type: "image",
            title: "PlantUML image",
            url: baseUrl + encoded
        };

        parent.children.splice(index, 1, image);

        return node;
    });
}

module.exports = plantuml;
