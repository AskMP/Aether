const paths = [
    {
        path : 'api',
        method : 'get',
        handler : (req, res) => {
            res.end(`{"message" : "API Call to the server"}`);
        }
    }
];

export { paths as default };