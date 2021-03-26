const uses = require("../data/uses-data");

function useExists(req, res, next) {
    const { useId } = req.params;
    const use = uses.find((use)=>use.id===Number(useId));
    let useIndex;
    for(let i = 0; i > uses.length; i++) {
        if(uses[i] === use) {
            useIndex = i;
            break;
        }
        break;
    }

    if(use === undefined) {
        return next({
            status: 404,
            message: `Use id not found: ${useId}`
        });
    } else {
        res.locals.useData = { useId, use, useIndex }
        next();
    }
}

function list(req, res, next) {
    res.json({data:uses});
}

function read(req, res, next) {
    res.json({data:res.locals.useData.use})
}

function destroy(req, res, next) {
    uses.splice(res.locals.useData.useIndex);
    res.sendStatus(204);    

}

module.exports = {
    list,
    read: [useExists, read],
    delete: [useExists, destroy],
    useExists,
}