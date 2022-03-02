module.exports.handler = (event, context, callback) => {
    console.log('----------------Lambda has been triggered----------------')
    console.log('Data: ', JSON.stringify((event)))
    let response;
    try {
        response = {
            statusCode: 200,
            body: JSON.stringify({
                message: 'hello world',
            }),
        };
    } catch (err) {
        console.log(err);
        response = {
            statusCode: 500,
            body: JSON.stringify({
                message: 'some error happened',
            }),
        };
    }

    return response;

}