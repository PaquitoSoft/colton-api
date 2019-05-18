const { AuthenticationError } = require('apollo-server-core');

// module.exports = (request, context) => {
//     // token = jwt.verify(context.request.get("Authorization"), "secret");
//     const authHeader = request.get('Authentication');

//     console.log('Authentication header:', authHeader);

//     if (!authHeader) {
//         throw new AuthenticationError("Not autheticated");
//     }

// };

const isPublicOperation = (operation, publicOperations) => (publicOperations.includes(operation));

module.exports.createAuthMiddleware = ({ publicOpertions = [], signature } = {}) => {
    return (resolve, root, args, context, info) => {
        console.log(`APPLYING auth middleware... ${info.fieldName} - isPublicOperation? ${isPublicOperation(info.fieldName, publicOpertions)}`);
        
        return resolve(root, args, context, info);
    };
}

// module.exports = (resolve, root, args, context, info) => {
//     console.log(`APPLYING auth middleware... ${info.fieldName}`);
//     return resolve(root, args, context, info);
// }


// module.exports = async (resolve, root, args, context, info) => {
//     console.log(`1. logInput root: ${JSON.stringify(root)}`);
//     console.log(`1. logInput args: ${JSON.stringify(args)}`);
//     console.log(`1. logInput info: ${info.fieldName}, ${info.schema}, ${info.operation}`);
//     const result = await resolve(root, args, context, info);
//     console.log(`4. logResult: ${JSON.stringify(result)}`);
//     return result;
// }
