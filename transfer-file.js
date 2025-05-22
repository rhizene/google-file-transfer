const {google} = require('googleapis');


/**
 * Lists the names and IDs of up to 10 files.
 * @param {OAuth2Client} authClient An authorized OAuth2 client.
 * @param {String} fieldId The target file for file transfer
 * @param {String} emailAddress The email to receive file transfer request
 */
async function transferFile(authClient, fileId, emailAddress) {
    const drive = await google.drive({version: 'v3', auth: authClient});
    const newWriterPermission = {
        type: 'user',
        role: 'writer',
        emailAddress,
        pendingOwner: true,
    };
    
    await drive.files.get({fileId})
        .then(()=>console.log('File exists'));
    const emailHasPermission = await checkPermission(drive, fileId, emailAddress);

    // if(emailHasPermission) return;

    try {
        console.log(`Creating file transfer request for ${emailAddress}...`);
        const response = await drive.permissions.create({
            fileId: fileId,
            requestBody: newWriterPermission,
            transferOwnership: false,
        });

        
        return transferFileResponse.data;
    } catch(error) {
        console.error('File Ownership transfer failed: ', error);
        throw error;
    }
}


async function checkPermission(drive, fileId, emailAddress) {
    try {
        const response = await drive.permissions.list({
            fileId: fileId,
            fields: 'permissions(id, emailAddress, role)',
        });

        const permissions = response.data.permissions;

        const hasPermission = permissions.some(permission => 
            permission.emailAddress === emailAddress
        );

        if (hasPermission) {
            console.log(`Permission exists for ${emailAddress}`);
        } else {
            console.log(`No permission found for ${emailAddress}`);
        }

        return hasPermission;
    } catch (error) {
        console.error('Error checking permissions:', error);
        throw error;
    }
}


async function getOwnerPermissionId(drive, fileId, emailAddress) {
    const permissions = await drive.permissions.list({
        fileId: fileId,
        fields: 'permissions(id, emailAddress, role)',
    });

    const newOwnerPermission = permissions.data.permissions.find(
        (perm) => perm.emailAddress === emailAddress
    );
    return newOwnerPermission ? newOwnerPermission.id : null;
}

module.exports = {transferFile};
