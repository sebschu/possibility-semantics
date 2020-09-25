
var percentages = [0, 10, 25, 40, 50, 60, 75, 90, 100];

var colors = ["blue", "orange"];
var modals = ["bare", "might", "probably", "could", "looks_like", "think"];

var sentences = {
	"blue": {"bare": "You'll get a blue one", 
	         "might": "You might get a blue one",
	         "probably": "You'll probably get a blue one",
	         "could": "You could get a blue one",
	         "looks_like": "It looks like you'll get a blue one",
	         "think": "I think you'll get a blue one",
           "bare_not": "You won't get a blue one",
           "possible": "It's possible that you'll get a blue one",
           "likely": "You'll likely get a blue one"},
  
	"orange": {"bare": "You'll get an orange one", 
	           "might": "You might get an orange one",
	           "probably": "You'll probably get an orange one",
	           "could": "You could get an orange one",
	           "looks_like": "It looks like you'll get an orange one",
	           "think": "I think you'll get an orange one",
             "bare_not": "You won't get an orange one",
             "possible": "It's possible that you'll get an orange one",
             "likely": "You'll likely get an orange one"}
};

var conditions = []

//might-possible-probably
var m1 = "might";
var m2 = "possible";
var m3 = "probably";
conditions.push({
	"expressions": [m1, m2, m3],
	"sentences": {
		"blue": [[m1, sentences["blue"][m1]], [m2, sentences["blue"][m2]], [m3, sentences["blue"][m3]]],
		"orange": [[m1, sentences["orange"][m1]], [m2, sentences["orange"][m2]], [m3, sentences["orange"][m3]]]
	}
});

