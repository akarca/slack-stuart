
/********************************************
 *
 * Get a food recommendation from Yelp with
 * an optional search terms.
 *
 * This plugin requires a custom Yelp API account.
 * To get yours, go here :
 *    http://www.yelp.com/developers/
 *
 * Author : Greg Tracy @gregtracy
 *
 ********************************************/

var logme = require('logme');
var _ = require('underscore');


// ask me anything - 8-ball answers
module.exports.run = function(request, cmd_args, stuart, plugin) {
  var yelp = require("yelp").createClient({
    consumer_key: plugin.config.key,
    consumer_secret: plugin.config.secret,
    token: plugin.config.token,
    token_secret: plugin.config.token_secret
  });

	var filter = cmd_args[0];
	if( filter === 'neyesek' ) {
		filter = 'lunch';
	}
	logme.debug('yelp filter : '+filter);

	yelp.search({term: filter, ll: plugin.config.location}, function(error, data) {
    if( error ) {
       logme.error('Yelp integration failed! ');
       console.dir(error);
       stuart.slack_post('The Yelpster is down right now :(', "#"+request.channel_name, request.user_name);
    } else {
      var yelp_result = _.sample(data.businesses);
      var output = "So you're hungry, @"+request.user_name+"?\n\n"
         + "How about, *"+yelp_result.name+"* today? It has a Yelp rating of "+yelp_result.rating+" / 5\n"
         + yelp_result.url + "\n"
         + yelp_result.location.display_address[0] + "\n"
         + "\n"
         + "I would totally join you, but I need to stay here to answer questions!";
      stuart.slack_post(output, "#"+request.channel_name, request.user_name);
    }
	});
};

module.exports.help = function(request, stuart) {
	stuart.slack_post("Lunch recommendations. Usage : \n\n"
      + "'/tavuk neyesek <filter>'"
      + "        (filter is optional)\n"
      + "Ex: '/tavuk neyesek thai'",
      '@'+request.user_name,
      request.user_name);
};