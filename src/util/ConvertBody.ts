export default (body: any): any => {
    if (Buffer.isBuffer(body)) body = JSON.parse(body.toString());
    else if (typeof body === 'string')
        body = JSON.parse(decodeURIComponent(body));
    return body;
};
