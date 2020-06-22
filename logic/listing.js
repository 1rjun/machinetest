const listing = async (data) => {

    let startingValue = data.startingValue;
    let lastValue = data.lastValue;
    const model = data.model;
    let countData, BlogList;

    if (startingValue === null || startingValue === "" || startingValue === undefined) {

        const json = `{ "status" : "false", "msg" : "Please provide the starting value." }`;
        return JSON.parse(json);
    }

    if (lastValue === undefined || !lastValue) {

        const json = `{ "status" : "false", "msg" : "Please provide the last value." }`;
        return JSON.parse(json);
    }

    // If starting and last value are sent in string format -- converting into number format.
    if (typeof (startingValue) === "string") startingValue = Number(startingValue)
    if (typeof (lastValue) === "string") lastValue = Number(lastValue);

    if (startingValue >= lastValue) {
        const json = ` {"status" : "false", "msg" : "Start value is greater than or equal to last value" }`;
        return JSON.parse(json);
    }

    let numberOfDataToFetch = lastValue - startingValue;

    countData = await model.countDocuments(data.query);
    if (lastValue > countData) { lastValue = countData }
    if (!data.listofFieldsTofetch) {
        BlogList = await model.find(data.query, (err, data) => {
            if (err) {
                const json = `{ "status" : "false", "msg" : "No template found" }`;
                return JSON.parse(json);
            }
        }).sort({ updatedAt: -1 }).skip(startingValue).limit(numberOfDataToFetch);
        // return

    }
    else {
        BlogList = await model.find(data.query, `${data.listofFieldsTofetch}`, (err, data) => {
            if (err) {
                const json = `{ "status" : "false", "msg" : "No template found" }`;
                return JSON.parse(json);
            }
        }).sort({ updatedAt: -1 }).skip(startingValue).limit(numberOfDataToFetch);
    }


    const list = JSON.stringify(BlogList);

    if (BlogList.length === 0) {
        const json = `{ "status" : "false", "msg" : "No data found", "data": ${list} }`;
        return JSON.parse(json);
    }

    const json = `{ "status" : true, "count" : ${countData}, "data" : ${list} }`;

    return JSON.parse(json);

}

module.exports = listing;
