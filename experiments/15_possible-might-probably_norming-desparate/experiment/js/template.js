


var REPETITIONS = 1;

function build_trials() {
	var trials = [];
	
	var cond = conditions[CONDITION];
	
	for (var i = 0; i < REPETITIONS; i++) {
		for (var j = 0; j < percentages.length; j++) {
			for (var k = 0; k < colors.length; k++) {
        var order = _.shuffle([0,1,2])
				var trial = {
					"expressions": cond["expressions"].join("-"),
					"sentences": [],
					"color": colors[k],
					"percentage_blue": percentages[j],
					"image": "./stimuli/scene_" + colors[k] + "_" + percentages[j] + ".gif"
				};
        var expressions_ordered = []
        for (var l = 0; l < order.length; l++) {
          trial["sentences"].push(cond["sentences"][colors[k]][order[l]]);
          expressions_ordered.push(cond["expressions"][order[l]]);
        }
        trial["order"] = expressions_ordered.join("-");
        trials.push(trial);
			}
		}
	}
	return trials;
}





function make_slides(f) {
  var   slides = {};

  slides.i0 = slide({
     name : "i0",
     start: function() {
      exp.startT = Date.now();
     }
  });

  slides.instructions = slide({
    name : "instructions",
		start: function() {
			$("#instructions-part2").hide();
			$("#instructions-part3").hide();
			this.step = 1;
		},
    button : function() {
			if (this.step == 1) {
				$("#instructions-part1").hide();
				$("#instructions-part2").show();
				this.step = 2;
			} else  if (this.step == 3){
				$("#instructions-part3").hide();
				$("#instructions-part1").show();
				this.step = 1;
			} else {
				if ($("input[name=checkquestion]:checked").val() !== "no") {
					$("#instructions-part2").hide(); 
					$("#instructions-part3").show();
					this.step = 3;
					exp.misread_instructions = exp.misread_instructions === undefined ? 1 : exp.misread_instructions;
				} else {
					exp.misread_instructions = exp.misread_instructions === undefined ? 0 : exp.misread_instructions;;
		      exp.go(); //use exp.go() if and only if there is no "present" data.
				}
				
			}
			
			
    }
  });

  slides.test_instructions = slide({
    name : "test_instructions",
    button : function() {
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.trial = slide({
    name: "trial",
    present: exp.trials,
    present_handle: function(stim) {
      $(".err").hide();
      this.stim = stim;
      
      //$(".display_condition").html(stim.prompt);
      
			$("#scene-image").attr("src", stim["image"]);
			$("#sent_1").text(stim["sentences"][0][1]);
			$("#sent_2").text(stim["sentences"][1][1]);
			$("#sent_3").text(stim["sentences"][2][1]);
			
			
			var callback = function () {
				
				var total = ($("#slider_1").slider("option", "value") +
           $("#slider_2").slider("option", "value") + 
           $("#slider_3").slider("option", "value") + 
           $("#slider_4").slider("option", "value"));
				
				
				if (total > 1.0) {
					var other_total = total - $(this).slider("option", "value");
					$(this).slider("option", "value", 1 - other_total);
				}
				
				var perc = Math.round($(this).slider("option", "value") * 100);
				$("#" + $(this).attr("id") + "_val").val(perc);
				
			}
			utils.make_slider("#slider_1", callback);			
			utils.make_slider("#slider_2", callback);
			utils.make_slider("#slider_3", callback);
			utils.make_slider("#slider_4", callback);
			
			$("#trial").fadeIn(700);
			
			
    //  $(".response-buttons").attr("disabled", "disabled");
      //$("#prompt").hide();
      //$("#audio-player").attr("autoplay", "true");

    },
    button : function(response) {
      this.response = response;
			
	    var total = ($("#slider_1").slider("option", "value") +
          $("#slider_2").slider("option", "value") + 
          $("#slider_3").slider("option", "value") + 
          $("#slider_4").slider("option", "value"));
			
			if (total < .99) {
	      $(".err").show();
			} else {
      	this.log_responses();
				var t = this;
				$("#trial").fadeOut(300, function() {
					window.setTimeout(function() {
						_stream.apply(t);
					}, 700);
				});
		}
      
    },

    log_responses : function() {
      for (var i = 0; i < 3; i++) {
        exp.data_trials.push({
          "expressions" : this.stim.expressions,
          "order" : this.stim.order,
          "sentence": this.stim.sentences[i][1],
          "modal" : this.stim.sentences[i][0],
          "rating" : $("#slider_" + (i+1)).slider("option", "value"),
          "percentage_blue": this.stim.percentage_blue,
          "color": this.stim.color
        });
      }

      exp.data_trials.push({
        "expressions" : this.stim.expressions,
        "order" : this.stim.order,
        "sentence": "something else",
        "modal" : "other",
        "rating" : $("#slider_4").slider("option", "value"),
        "percentage_blue": this.stim.percentage_blue,
        "color": this.stim.color
      });
    }
  });





  slides.subj_info =  slide({
    name : "subj_info",
    submit : function(e){
      //if (e.preventDefault) e.preventDefault(); // I don't know what this means.
      exp.subj_data = {
        language : $("#language").val(),
        other_languages : $("#other-language").val(),
        asses : $('input[name="assess"]:checked').val(),
        comments : $("#comments").val(),
        problems: $("#problems").val(),
        fairprice: $("#fairprice").val(),
        "misread_instructions": exp.misread_instructions,
        "condition": exp.condition,
        "time_in_minutes" : (Date.now() - exp.startT)/60000
      };
      exp.go(); //use exp.go() if and only if there is no "present" data.
    }
  });

  slides.thanks = slide({
    name : "thanks",
    start : function() {
      exp.data= {
          "trials" : exp.data_trials,
          "system" : exp.system,
          "subject_information" : exp.subj_data
      };
      proliferate.submit(exp.data);
    }
  });
  
  slides.auth = slide({
      "name": "auth",
      start: function() {

          $(".err").hide();
          // define possible speaker and listener names
          // fun fact: 10 most popular names for boys and girls
          var speaker = _.shuffle(["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles"])[0];
          var listener = _.shuffle(["Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Margaret"])[0];

          var story = speaker + ' says to ' + listener + ': "It\'s a beautiful day, isn\'t it?"'

          $("#check-story").text(story);
          $("#check-question").text("Who is " + speaker + " talking to?");
          this.trials = 0;
          this.listener = listener;

      },
      button: function() {
          this.trials++;
          $(".err").hide();
          resp = $("#check-input").val();
          if (resp.toLowerCase() == this.listener.toLowerCase()) {
              exp.go();
          } else {
              if (this.trials < 2) {
                  $("#check-error").show();
              } else {
                  $("#check-error-final").show();
                  $("#check-button").attr("disabled", "disabled");
              }
          }
      }
  });
  

  return slides;
}

/// init ///
function init() {
  exp.condition = CONDITION;
  exp.trials = _.shuffle(build_trials());
  exp.catch_trials = [];
  exp.system = {
      Browser : BrowserDetect.browser,
      OS : BrowserDetect.OS,
      screenH: screen.height,
      screenUH: exp.height,
      screenW: screen.width,
      screenUW: exp.width
    };
  //blocks of the experiment:
  exp.structure=["i0", "auth", "instructions", "trial", 'subj_info', 'thanks'];

  exp.data_trials = [];
  //make corresponding slides:
  exp.slides = make_slides(exp);

  exp.nQs = utils.get_exp_length(); //this does not work if there are stacks of stims (but does work for an experiment with this structure)
                    //relies on structure and slides being defined

  $('.slide').hide(); //hide everything

  //make sure turkers have accepted HIT (or you're not in mturk)
  $("#start_button").click(function() {
    if (turk.previewMode) {
      $("#mustaccept").show();
    } else {
      $("#start_button").click(function() {$("#mustaccept").show();});
      exp.go();
    }
  });

 


  exp.go(); //show first slide
	
	imgs = [];
	
	for (var i = 0; i < exp.trials.length; i++) {
		imgs.push(exp.trials[i].image);
	}
	
	preload(imgs);
	
}
