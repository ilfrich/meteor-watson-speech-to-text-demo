import { Meteor } from 'meteor/meteor';
import watson from 'watson-developer-cloud';
import Future from 'fibers/future';



/**
 * Create authorization service for speech-to-text
 */
var sttConfig = {
    version: 'v1',
    url: 'https://stream.watsonplatform.net/speech-to-text/api',
    username: process.env.STT_USERNAME,
    password: process.env.STT_PASSWORD
}

var sttAuthService = watson.authorization(sttConfig);


Meteor.methods({

    getAuthToken: function() {

        var asynResult = new Future();
        console.log(sttConfig);
        sttAuthService.getToken({ url : sttConfig.url }, function(err, token) {
            if (err) {
                console.log(err);
                asynResult.throw(err);
            } else {
                console.log(token);
                asynResult.return(token)
            }
        });

        return asynResult.wait();
    }

});