module.exports = {
    parameterize: function(...args) {
        let str = args[0];
        for (let i = 1; i <= args.length; i++) {
            str = str.replace(`$` + i, args[i]);
        }
        return str;
    },
};

