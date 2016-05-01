
/**
 * When the page is loaded, retrieve auth token and store it with the template.
 */
Template.demo.rendered = function() {

    Meteor.call('getAuthToken', function(err, data) {
        if (!err) {

            Template.demo.authToken = data;
            console.log('Retrieved auth token: ' + data);
            $('#speech').removeAttr('disabled');

        } else {

            console.error('Error retrieving auth token: ' + err.message);

        }
    });

}



/**
 * Display related functions
 */

Template.demo.transcript = new ReactiveVar('');
Template.demo.currentSentence = new ReactiveVar('');

Template.demo.helpers({

    transcript: function() {
        return Template.demo.transcript.get();
    },

    currentSentence: function() {
        return Template.demo.currentSentence.get();
    }

});



/**
 * Event related variables and functions
 */

Template.demo.recording = false;
Template.demo.mic;

Template.demo.events({

    'click #speech': function(e) {

        if (Template.demo.authToken !== undefined) {

            if (Template.demo.recording === false) {

                // create microphone and connect to the socket
                Template.demo.mic = new Microphone({});
                $('#speech .fa-microphone').removeClass('fa-microphone').addClass('fa-ellipsis-h');
                sAlert.info("Creating Socket Connecting.");
                handleMicrophone(Template.demo.authToken, 'en-UK_BroadbandModel', Template.demo.mic, Template.demo.onMessage, function (err, data) {

                    // start recording
                    Template.demo.mic.record();
                    Template.demo.recording = true;
                    sAlert.success("Recording...");

                    $('#speech .fa-ellipsis-h').removeClass('fa-ellipsis-h').addClass('fa-stop');

                });

            } else {

                // stop recording
                Template.demo.recording = false;
                Template.demo.mic.stop();
                sAlert.success("Recording Stopped.");

                $('#speech .fa-stop').removeClass('fa-stop').addClass('fa-microphone');

            }
        } else {

            sAlert.error("Authentication Pending.");

        }
    }
});





/**
 * Transcript related variables and functions
 */


Template.demo.onMessage = function(msg) {

    console.log(msg);
    // handle current sentence and make sure it starts with a capital letter
    var transcript = msg[0].alternatives[0].transcript;
    transcript = transcript.charAt(0).toUpperCase() + transcript.substr(1, transcript.length);
    Template.demo.currentSentence.set(transcript);

    // handle the end of a sentence
    var isFinal = msg[0].final;
    if (isFinal) {

        // append the current sentence to the complete transcript
        Template.demo.transcript.set(Template.demo.transcript.get() + transcript.trim() + '. ');
        // reset the current sentence
        Template.demo.currentSentence.set('');

    }

}
