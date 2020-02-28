const parameterize = () => {
    let str = arguments[0];
    for (let i = 1; i <= arguments.length; i++) {
        str.replace(`$` + i, arguments[i]);
    }
};

exports = {parameterize};
