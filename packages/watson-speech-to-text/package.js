Package.describe({
    name: 'ilfrich:watson-speech-to-text',
    version: '1.0.0',
    summary: 'Microphone / Socket handler for IBM Watson Speech-to-Text service.',
    git: 'https://github.com/ilfrich/meteor-watson-speech-to-text',
    documentation: 'README.md'
});

Npm.depends({

});

Package.onUse(function(api) {
    api.versionsFrom('1.3.1');

    api.use(['ecmascript@0.1.6']);

    api.mainModule('Microphone.js', 'client');
    api.mainModule('handlemicrophone.js', 'client');
    api.mainModule('socket.js', 'client');


    api.export('Microphone', 'client');
    api.export('initSocket', 'client');
    api.export('handleMicrophone', 'client');

});