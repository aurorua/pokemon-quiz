$(document).ready(function() {
	
	// Globals
	var MAX_HP = 420;
	var CURRENT_HP = 420;
	
	var MAX_QP = 3000;
	var CURRENT_QP = 0;
	var ARC_ANGLE = 1;
	
	var FLAG_ACTION = false;
	var DIFFICULTY = 2;
	
	var items = [
		{name: "Potion", description: "A spray-type medicine for treating wounds. It restores 15% of your max HP.", count: 4},
		{name: "Super Potion", description: "A spray-type medicine for treating wounds. It restores 25% of your max HP.", count: 3},
		{name: "Hyper Potion", description: "A spray-type medicine for treating wounds. It restores 40% of your max HP.", count: 2},
		{name: "Max Potion", description: "A spray-type medicine for treating wounds. It fully restores your max HP.", count: 1}
	];
	
	// Damage (min~max): [((ATK + S.ATK - 10) / 2) - abs(ATK - S.ATK)] ~ [(ATK + S.ATK - 10) / 2]
	// Damage Bonus:
	//		Tier 1 - 100%
	//		Tier n - (Total stat of n)/(Total stat of base}%
	var questions = [
		{name: "Bulbasaur", question: "What does Bulbasaur store in the bulb on its back?", size: "small", minDamage: 36, maxDamage: 52},
		{name: "Ivysaur", question: 'Ivysaur is ready to evolve when its flower bud <span class="fill-in-blank">          </span>.', size: "medium", minDamage: 61, maxDamage: 84},
		{name: "Venusaur", question: "Which of the following physical characteristics DO NOT change between Venusaur and its pre-evolved forms?", size: "x-large", minDamage: 112, maxDamage: 142},
		{name: "Charmander", question: 'The flame on the tip of Charmander\'s tail DOES NOT indicate <span class="fill-in-blank">          </span>.', size: "small", minDamage: 43, maxDamage: 51},
		{name: "Charmeleon", question: "Charmeleon actively seeks out strong opponents to fight. In this excited state, what color does its tail burn?", size: "medium", minDamage: 67, maxDamage: 88},
		{name: "Charizard", question: 'Charizard is a dual-type <span class="fill-in-blank">          </span> Pokemon.', size: "x-large", minDamage: 115, maxDamage: 158},
		{name: "Squirtle", question: 'Ash\'s Squirtle was the leader of the <i>Squirtle Squad</i>. Each member of the squad <span class="fill-in-blank">          </span>.', size: "small", minDamage: 42, maxDamage: 44},
		{name: "Wartortle", question: "What does Wartortle's fluffy tail symbolize?", size: "medium", minDamage: 74, maxDamage: 76},
		{name: "Blastoise", question: 'Blastoise has two water cannons in its shell, while Mega Blastoise has <span class="fill-in-blank">          </span> in its <i>shell</i>.', size: "large", minDamage: 130, maxDamage: 133},
		{name: "Caterpie", question: 'The red antenna on Caterpie\'s head can <span class="fill-in-blank">          </span>.', size: "x-small", minDamage: 10, maxDamage: 20},
		{name: "Metapod", question: "In the image above, what direction is Metapod facing (from your perspective)?", size: "small", minDamage: 13, maxDamage: 18},
		{name: "Butterfree", question: 'Ash\'s Butterfree fell in love with a <span class="fill-in-blank">          </span> Butterfree.', size: "medium", minDamage: 35, maxDamage: 127},
		{name: "Weedle", question: "What Pokemon did Ash choose to help catch his first Weedle?", size: "x-small", minDamage: 8, maxDamage: 23},
		{name: "Kakuna", question: "What is the only move Kakuna knows when caught in the wild?", size: "small", minDamage: 21, maxDamage: 21},
		{name: "Beedrill", question: 'Despite having wings, Beedrill is not a Flying type Pokemon but a <span class="fill-in-blank">          </span> type Pokemon.', size: "medium", minDamage: 35, maxDamage: 127},
		{name: "Pidgey", question: 'Pidgey was originally going to be named <span class="fill-in-blank">          </span>.', size: "small", minDamage: 25, maxDamage: 35},
		{name: "Pidgeotto", question: "What color changes occur to the feathers of Pidgeotto's head or tail when it evolves?", size: "large", minDamage: 56, maxDamage: 70},
		{name: "Pidgeot", question: 'Pidgeot DOES NOT have the ability to <span class="fill-in-blank">          </span>.', size: "x-large", minDamage: 115, maxDamage: 134},
		{name: "Rattata", question: "What is the correct pronunciation of Rattata?", size: "small", minDamage: 5, maxDamage: 36},
		{name: "Raticate", question: "Raticate serves as the sidekick of what Team Rocket duo?", size: "medium", minDamage: 48, maxDamage: 99},
		{name: "Spearow", question: "What does Ash ride to escape from the angry flock of Spearow in the first episode?", size: "small", minDamage: 12, maxDamage: 41},
		{name: "Fearow", question: "Fearow closely resembles what Legendary Pokemon?", size: "large", minDamage: 70, maxDamage: 119},
		{name: "Ekans", question: "What move does Ekans learn at Level 1?", size: "small", minDamage: 25, maxDamage: 45},
		{name: "Arbok", question: "In the most recent generation of Pokemon, what is the effect of Arbok's <i>Shed Skin</i> move?", size: "large", minDamage: 76, maxDamage: 106},
		{name: "Pikachu", question: "What is needed for <i>Pichu</i> to evolve into Pikachu?", size: "small", minDamage: 43, maxDamage: 48}
	];
	
	var NUM_QUESTIONS = questions.length;
	var NUM_CORRECT = 0;
	var CURRENT_QNUM = 0;
	
	// Reward: the Total stat divided by 6
	var answers = [
		// Bulbasaur
		[{answer: "Energy collected from sunlight", isCorrect: true, reward: 53},
		 {answer: "Cloves of a garlic-like plant", isCorrect: false, reward: -80},
		 {answer: "A sticky nectar to trap prey", isCorrect: false, reward: -50},
		 {answer: "Its long vines", isCorrect: false, reward: -20}],
		// Ivysaur
		[{answer: "gives off a pleasant, sweet aroma", isCorrect: true, reward: 68},
		 {answer: "releases a waft of Sleep Powder", isCorrect: false, reward: -80},
		 {answer: "glows a bright blue color", isCorrect: false, reward: -20},
		 {answer: "begins to shake vigorously", isCorrect: false, reward: -50}],
		// Venusaur
		[{answer: "Its skin texture", isCorrect: false, reward: -50},
		 {answer: "Its eye color", isCorrect: true, reward: 88},
		 {answer: "Its ear shape", isCorrect: false, reward: -20},
		 {answer: "Its flower", isCorrect: false, reward: -80}],
		// Charmander
		[{answer: "the condition of Charmander's life force", isCorrect: false, reward: -20},
		 {answer: "the power of Charmander's attacks", isCorrect: false, reward: -80},
		 {answer: "whether Charmander is happy or enraged", isCorrect: false, reward: -50},
		 {answer: "when Charmander is ready to evolve", isCorrect: true, reward: 52}],
		// Charmeleon
		[{answer: "yellowish green", isCorrect: false, reward: -50},
		 {answer: "bluish white", isCorrect: true, reward: 68},
		 {answer: "dark purple", isCorrect: false, reward: -20},
		 {answer: "hot pink", isCorrect: false, reward: -80}],
		// Charizard
		[{answer: "Fire/Flying", isCorrect: true, reward: 89},
		 {answer: "Fire/Dragon", isCorrect: false, reward: -20},
		 {answer: "Fire/Fighting", isCorrect: false, reward: -50},
		 {answer: "Fire/Steel", isCorrect: false, reward: -80}],
		// Squirtle
		[{answer: "wears sunglasses", isCorrect: true, reward: 52},
		 {answer: "carries a police baton", isCorrect: false, reward: -50},
		 {answer: "rides a motorcycle", isCorrect: false, reward: -20},
		 {answer: '"smokes" a cigar', isCorrect: false, reward: -80}],
		// Wartortle
		[{answer: "Agility", isCorrect: false, reward: -20},
		 {answer: "Prosperity", isCorrect: false, reward: -50},
		 {answer: "Longevity", isCorrect: true, reward: 68},
		 {answer: "Spirituality", isCorrect: false, reward: -80}],
		// Blastoise
		[{answer: "one water cannon", isCorrect: true, reward: 88},
		 {answer: "three water cannons", isCorrect: false, reward: -20},
		 {answer: "four water cannons", isCorrect: false, reward: -50},
		 {answer: "no water cannons", isCorrect: false, reward: -80}],
		// Caterpie
		[{answer: "emit a stench to repel predetors", isCorrect: true, reward: 33},
		 {answer: "spray a sticky silk to entangle foes", isCorrect: false, reward: -50},
		 {answer: "glow bright red to attract other Pokemon", isCorrect: false, reward: -20},
		 {answer: "spin rapidly to propel itself in the air", isCorrect: false, reward: -80}],
		// Metapod
		[{answer: "My left", isCorrect: true, reward: 34},
		 {answer: "My right", isCorrect: false, reward: -20},
		 {answer: "Away from me", isCorrect: false, reward: -80},
		 {answer: "Towards me", isCorrect: false, reward: -80}],
		// Butterfree
		[{answer: "pink", isCorrect: true, reward: 66},
		 {answer: "purple", isCorrect: false, reward: -80},
		 {answer: "shiny", isCorrect: false, reward: -50},
		 {answer: "blue", isCorrect: false, reward: -20}],
		// Weedle
		[{answer: "Pidgeotto", isCorrect: true, reward: 33},
		 {answer: "Tauros", isCorrect: false, reward: -80},
		 {answer: "Pikachu", isCorrect: false, reward: -20},
		 {answer: "Charmander", isCorrect: false, reward: -50}],
		// Kakuna
		[{answer: "Harden", isCorrect: true, reward: 34},
		 {answer: "Poison Sting", isCorrect: false, reward: -20},
		 {answer: "Bug Bite", isCorrect: false, reward: -50},
		 {answer: "String Shot", isCorrect: false, reward: -80}],
		// Beedrill
		[{answer: "Bug/Poison", isCorrect: true, reward: 66},
		 {answer: "Bug/Fighting", isCorrect: false, reward: -20},
		 {answer: "Bug/Steel", isCorrect: false, reward: -80},
		 {answer: "Bug/Grass", isCorrect: false, reward: -50}],
		// Pidgey
		[{answer: "Pidge", isCorrect: true, reward: 42},
		 {answer: "Pidget", isCorrect: false, reward: -50},
		 {answer: "Pidgeon", isCorrect: false, reward: -20},
		 {answer: "Piddy", isCorrect: false, reward: -80}],
		// Pidgeotto
		[{answer: "All its head feathers turn yellow.", isCorrect: false, reward: -80},
		 {answer: "Its tail feathers retain the same two colors.", isCorrect: false, reward: -20},
		 {answer: "Its head feathers retain the same red color.", isCorrect: false, reward: -50},
		 {answer: "All its tail feathers turn red.", isCorrect: true, reward: 58}],
		// Pidgeot
		[{answer: "reach an altitude 10 miles high", isCorrect: true, reward: 80},
		 {answer: "race through the sky at 1500 mph", isCorrect: false, reward: -20},
		 {answer: "spot Magikarp while flying 3300 ft. in the air", isCorrect: false, reward: -50},
		 {answer: "create 200 mph wind gusts with its wings", isCorrect: false, reward: -80}],
		// Rattata
		[{answer: "Ruh-TAH-tuh", isCorrect: true, reward: 42},
		 {answer: "Rat-tuh-TAT-tuh", isCorrect: false, reward: -80},
		 {answer: "RAT-tuh-tat", isCorrect: false, reward: -50},
		 {answer: "RAT-tuh-tah", isCorrect: false, reward: -20}],
		// Raticate
		[{answer: "Cassidy and Butch", isCorrect: true, reward: 69},
		 {answer: "Jesse and James", isCorrect: false, reward: -20},
		 {answer: "Merrill and Dunce", isCorrect: false, reward: -80},
		 {answer: "Rachael and Robin", isCorrect: false, reward: -50}],
		// Spearow
		[{answer: "Misty's bike", isCorrect: true, reward: 44},
		 {answer: "Officer Jenny's motorcycle", isCorrect: false, reward: -20},
		 {answer: "His Tauros", isCorrect: false, reward: -50},
		 {answer: "Team Rocket's air balloon", isCorrect: false, reward: -80}],
		// Fearow
		[{answer: "Ho-Oh", isCorrect: true, reward: 74},
		 {answer: "Lugia", isCorrect: false, reward: -50},
		 {answer: "Articuno", isCorrect: false, reward: -20},
		 {answer: "Latias", isCorrect: false, reward: -80}],
		// Ekans
		[{answer: "Wrap", isCorrect: true, reward: 48},
		 {answer: "Poison Sting", isCorrect: false, reward: -50},
		 {answer: "Acid", isCorrect: false, reward: -80},
		 {answer: "Coil", isCorrect: false, reward: -20}],
		// Arbok
		[{answer: "Heals its status conditions", isCorrect: true, reward: 73},
		 {answer: "Increases its Attack but lowers its Defense", isCorrect: false, reward: -20},
		 {answer: "Increases its Speed and Evasion", isCorrect: false, reward: -50},
		 {answer: "Restores up to 50% of its max HP", isCorrect: false, reward: -80}],
		// Pikachu
		[{answer: "A high level of friendship with its Trainer", isCorrect: true, reward: 53},
		 {answer: "Exposure to a Thunderstone", isCorrect: false, reward: -20},
		 {answer: "Plenty of sleep inside an incubator", isCorrect: false, reward: -50},
		 {answer: "Charge from a high-voltage current", isCorrect: false, reward: -80}]
	];
	
	var order = [];
	for (var i = 1; i <= NUM_QUESTIONS; i++) {
	   order.push(i);
	}
	shuffle(order);
	console.log(order);
	
	// Enable tooltips
	$('[data-toggle="tooltip"]').tooltip();
	$('#img1').tooltip({
		title: '<h3 id="header1" class="tooltip-header"></h3>'
			+ '<p id="label1" class="tooltip-label">Damage: </p>'
			+ '<p id="data1" class="tooltip-data"></p>',
		html: true,
		placement: "right"
	});
	$('#img2').tooltip({
		title: '<h3 id="header2" class="tooltip-header"></h3>'
			+ '<p id="label2" class="tooltip-label">Damage: </p>'
			+ '<p id="data2" class="tooltip-data"></p>',
		html: true,
		placement: "left"
	});
	
	// Close nav on outside click
	$(document).click(function (event) {
        var clickover = $(event.target);
        var _opened = $(".navbar-collapse").hasClass("navbar-collapse collapse in");
        if (_opened === true && !clickover.hasClass("navbar-toggle"))
		{
            //$("button.navbar-toggle").click();
			$('.collapse').collapse('hide');
        }
    });
	
	// Animate nav menu open on click
	$('.navbar-toggle').click(function() {
		if (!FLAG_ACTION) {
			FLAG_ACTION = true;
			$('.item-ripple-1, .item-ripple-2').show(0);
			$('.item-ripple-1').animate({
				width: "20em",
				height: "20em",
				opacity: 1
			}, 550, "swing", function() {
			});
			$('.item-ripple-2').animate({
				width: "15em",
				height: "15em",
				opacity: 1
			}, 250, "swing", function() {
			});
			setTimeout(function() {
				$('.item-ripple-1, .item-ripple-2').fadeOut(150);
				$('.item-ripple-1, .item-ripple-2').promise().done(function() {
					$(this).removeAttr('style');
					FLAG_ACTION = false;
				});
			}, 100);
		}
	});
	
	// On window resize
	$(window).resize(function() {
		adjustTooltipPlacement();
	});
	
	// Shuffle elements in array
	function shuffle(array) {
		var currentIndex = array.length, temporaryValue, randomIndex;

		// While there remain elements to shuffle...
		while (0 !== currentIndex) {

			// Pick a remaining element...
			randomIndex = Math.floor(Math.random() * currentIndex);
			currentIndex -= 1;

			// And swap it with the current element.
			temporaryValue = array[currentIndex];
			array[currentIndex] = array[randomIndex];
			array[randomIndex] = temporaryValue;
		}

		return array;
	}
	
	// Initialize item confirmation dialog box
	function initDialog() {
		$( ".dialog-item-confirm" ).dialog({
			dialogClass: 'centered-offset',
			height: "auto",
			width: "auto",
			autoOpen: false,
			draggable: false,
			resizable: false,
			modal: true,
			open: function(){
				$('.ui-widget-overlay').hide().fadeIn(200);
				if (CURRENT_HP == MAX_HP) {
					$(".ui-dialog-buttonpane button:contains('Yes')").button("disable");
					$('.alert-info').html('<p><b>Info! </b>Your HP is full. You cannot use potions at max HP.</p>');
					$('.alert-info').show(200);
				}
			},
			show: {
				effect: "fade",
				duration: 200
			},
			buttons: {
				"Yes": function() {
					var element = $(this).attr("id");
					var hasItem = updateItems(element);
					$(".ui-dialog-buttonpane button:contains('Yes')").button("disable");
					$(".ui-dialog-buttonpane button:contains('Cancel')").text('Close');
					setTimeout(function(){
						if (hasItem) {
							if (CURRENT_HP < MAX_HP) {
								$(".ui-dialog-buttonpane button:contains('Yes')").button("enable");
								$(".ui-dialog-buttonpane button:contains('Yes')").blur();
							} else {
								$('.alert-info').html('<p><b>Info! </b>Your HP is full. You cannot use potions at max HP.</p>');
								$('.alert-info').show(200);
							}
						} else {
							var name = "";
							if (element == "potion") { name = "Potions"; }
							else if (element == "super-potion") { name = "Super Potions"; }
							else if (element == "hyper-potion") { name = "Hyper Potions"; }
							else if (element == "max-potion") { name = "Max Potions"; }
							$('.alert-info').html('<p><b>Info! </b>You have no ' + name + ' left.</p>');
							$('.alert-info').show(200);
						}
					}, 1400);
				},
				Cancel: function() {
					$(this).dialog( 'option', 'hide', { effect: "fade", duration: 200 } );
					$(this).dialog({ beforeClose: function() {
						$('.ui-widget-overlay:first')
						.clone()
						.appendTo('body')
						.show()
						.fadeOut(200, function(){ 
							$(this).remove(); 
						});
					}});
					$('.alert-info').hide(200);
					$(this).dialog( "close" );
				}
			}
		});
		$( ".dialog-quit-game" ).dialog({
			dialogClass: 'centered',
			height: "auto",
			width: "auto",
			autoOpen: false,
			draggable: false,
			resizable: false,
			modal: true,
			open: function(){
				$('.ui-widget-overlay').hide().fadeIn(200);
				$(".ui-dialog-buttonpane button:contains('Yes')").button("enable");
				$(".ui-dialog-buttonpane button:contains('Close')").text('Cancel');
			},
			show: {
				effect: "fade",
				duration: 200
			},
			buttons: {
				"Yes": function() {
					//var innerWidth = window.innerWidth;
					//var outerWidth = window.outerWidth;
					//var padding = outerWidth - innerWidth;
					
					//$('.centered').css("left", "calc(50% - " + padding + "px)!important");
					//$('.navbar-toggle').css("padding-right", padding + "px");
					
					$(this).dialog( 'option', 'hide', { effect: "fade", duration: 200 } );
					$(this).dialog({ beforeClose: function() {
						$('.ui-widget-overlay:first')
						.clone()
						.appendTo('body')
						.show()
						.fadeOut(200, function(){
							$(this).remove(); 
						});
					}});
					
					// Hide all HUD elements
					hideAll();
					
					// Close dialog box
					$(this).dialog( "close" );
				},
				Cancel: function() {
					$(this).dialog( 'option', 'hide', { effect: "fade", duration: 200 } );
					$(this).dialog({ beforeClose: function() {
						$('.ui-widget-overlay:first')
						.clone()
						.appendTo('body')
						.show()
						.fadeOut(200, function(){ 
							$(this).remove(); 
						});
					}});
					$(this).dialog( "close" );
				}
			}
		});
	};
	initDialog();
	
	// Remove dialog box autofocus
	$.ui.dialog.prototype._focusTabbable = $.noop;
	
	// Open item confirmation dialog box
	$('.item').click(function() {
		// do the following if the item is not disabled
		if (!$(this).hasClass("disabled")) {
			$(".ui-dialog-buttonpane button:contains('Yes')").button("enable");
			$(".ui-dialog-buttonpane button:contains('Close')").text('Cancel');
			var element = $(this).attr('id');
			if (element == "item1") {
				$(".dialog-item-confirm").attr("id","potion");
				$(".dialog-item-confirm").dialog('option', 'title', 'Use Potion?');
				var quantity = " You have <b>" + items[0].count + " Potion(s) remaining</b>."
				$(".item-description").html(items[0].description + quantity);
				$(".item-img").attr("src","img/pogo-potion.png");
				/* $(window).on("load", function() {
					$(".item-img").attr("src","img/pogo-potion.png");
				}); */
			} else if (element == "item2") {
				$(".dialog-item-confirm").attr("id","super-potion");
				$(".dialog-item-confirm").dialog('option', 'title', 'Use Super Potion?');
				var quantity = " You have <b>" + items[1].count + " Super Potion(s) remaining</b>."
				$(".item-description").html(items[1].description + quantity);
				$(".item-img").attr("src","img/pogo-super-potion.png");
			} else if (element == "item3") {
				$(".dialog-item-confirm").attr("id","hyper-potion");
				$(".dialog-item-confirm").dialog('option', 'title', 'Use Hyper Potion?');
				var quantity = " You have <b>" + items[2].count + " Hyper Potion(s) remaining</b>."
				$(".item-description").html(items[2].description + quantity);
				$(".item-img").attr("src","img/pogo-hyper-potion.png");
			} else if (element == "item4") {
				$(".dialog-item-confirm").attr("id","max-potion");
				$(".dialog-item-confirm").dialog('option', 'title', 'Use Max Potion?');
				var quantity = " You have <b>" + items[3].count + " Max Potion(s) remaining</b>."
				$(".item-description").html(items[3].description + quantity);
				$(".item-img").attr("src","img/pogo-max-potion.png");
			}
			updateHP(0); // load HP in dialog box
			$(".dialog-item-confirm").dialog("open");
		}
	});
	
	function init() {
		// Init page
		$('.title-wrapper').animate({
			opacity: "1"
		}, 400, "swing", function() {
		});
		$('.main, footer').fadeOut(200);
		$('.results').fadeOut();
		
		// Initialize arc
		updateQP(10);
		
		// Initialize items
		$('#item1 .item-count').text("x" + items[0].count);
		$('#item2 .item-count').text("x" + items[1].count);
		$('#item3 .item-count').text("x" + items[2].count);
		$('#item4 .item-count').text("x" + items[3].count);
		
		// Initialize alerts
		$('.alert-info').hide(200);
		
		// Initialize tooltip placement
		adjustTooltipPlacement();
		
		// Hide highlight circles
		hideHighlights();
	}
	init();
	
	// Start quiz on img click
	$('.title-img').click(function() {
		$(this).unbind('click');
		$('.ripple-1, .ripple-2').show(0);
		$('.ripple-1').animate({
			width: "50em",
			height: "50em",
			opacity: 1
		}, 300, "swing", function() {
		});
		$('.ripple-2').animate({
			width: "75em",
			height: "75em",
			opacity: 1
		}, 600, "swing", function() {
		});
		
		$('.main, footer').fadeIn(200);
		$('.title-wrapper').animate({
			opacity: "0"
		}, 800, "swing", function() {
			$('.title-wrapper').hide();
		});
		$('.title-wrapper').promise().done(function() {
			$('body').css("overflow-y","scroll");
			$('.counter').animate({
				top: "0"
			}, 600, "swing", function() {
			});
			$('.main').animate({
				marginTop: "0"
			}, 1600, "swing", function() {
			});
			$('.navbar-toggle').animate({
				bottom: "6em"
			}, 800, "swing", function() {
				showHighlights();
				nextQandA();
			});
		});
	});
	
	// Reset quiz
	$('.close-button').click(function() {
		$(".dialog-quit-game").dialog("open");
	});
	
	// Hide all HUD elements
	function hideAll() {
		// Hide counter
		$('.counter').animate({
			top: "-18em"
		}, 600, "swing", function() {
		});
		
		// Hide highlight
		$('.highlight').animate({
			opacity: "0"
		}, 200, "swing", function() {
			// Slide away main content
			$('.main').animate({
				marginTop: "150vh"
			}, 1200, "swing", function() {
				location.reload();
			});
		});
		
		// Hide nav button and menu
		$('.collapse').collapse('hide');
		$('.navbar-toggle').animate({
			bottom: "-100vh"
		}, 800, "swing", function() {
		});
	}
	
	// Hide highlight circles
	function hideHighlights() {
		$('.highlight-circle-1').fadeOut(0);
		$('.highlight-circle-2').fadeOut(0);
		$('.highlight-circle-3').fadeOut(0);
	}
	
	// Show highlight circles
	function showHighlights() {
		$('.highlight-circle-1').delay(600).fadeIn(600);
		$('.highlight-circle-2').delay(800).fadeIn(800);
		$('.highlight-circle-3').delay(1000).fadeIn(800);
	}
	
	// Update QP arc
	function updateArc() {
		var percentage = CURRENT_QP / MAX_QP;
		var skew = Math.floor(180 * percentage);
		if (skew <= 1) { skew = 2;}
		
		// remove previous arc classes
		$('.arc-partial-left').removeClass("arc-" + ARC_ANGLE);
		$('.arc-partial-right').removeClass("arc-" + (ARC_ANGLE - 90));
		$('.arc-partial-left').removeClass("arc-90");
		$('.arc-partial-right').removeClass("arc-90");
		
		// add new arc classes
		if (skew <= 90) {
			$('.arc-partial-left').addClass("arc-" + skew);
		} else {
			var offset = skew - 90;
			if (offset <= 1) { offset = 2;}
			
			if (ARC_ANGLE <= 90) { // smooth out halfway point
				$('.arc-partial-left').addClass("arc-90");
				$(".arc-partial-left").animate({
					backgroundColor: "transparent"
					}, 750, function() {
						$('.arc-partial-right').removeClass("arc-0");
						setTimeout(function(){
							$('.arc-partial-right').addClass("arc-" + offset);
						}, 50);
				});
			} else {
				$('.arc-partial-left').addClass("arc-90");
				$('.arc-partial-right').addClass("arc-" + offset);
			}
		}
		ARC_ANGLE = skew;
		
		$(".arc").animate({
			borderColor: "rgba(51,255,255,.85)"
			}, 200, function() {
				$(".arc").animate({
					borderColor: "rgba(0,51,51,.1)"
					}, 1200, function() {
				});
		});
	}
	
	// Update QP
	function updateQP(amount) {
		var previousQP = CURRENT_QP;
		CURRENT_QP += amount;
		
		// error checking
		if (CURRENT_QP <= 0) {
			CURRENT_QP = 0;
		}
		if (CURRENT_QP >= MAX_QP) {
			CURRENT_QP = MAX_QP;
		}
		
		// Animate QP text
		var step = Math.floor((CURRENT_QP - previousQP) / 10);
		var interval = setInterval(function(){
			previousQP += step;
			$("#cp").html("<span>QP</span>" + previousQP);
		}, 80);
		setTimeout(function(){
			clearInterval(interval);
			$("#cp").html("<span>QP</span>" + CURRENT_QP);
		}, 720);
		
		updateArc();
	}
	
	// Update HP bar
	function updateBar(amount) {
		var percentage = CURRENT_HP / MAX_HP;
		var health = Math.round(MAX_HP * percentage);
		
		if (percentage <= .25) {
			$('.bar-fill').css("background-color", "rgb(255,127,127)");
		} else if (percentage > .25 && percentage <= .50) {
			$('.bar-fill').css("background-color", "rgb(247,212,61)");
		} else {
			$('.bar-fill').css("background-color", "rgb(107,239,182)");
		}
		
		// Animate HP bar
		$('.bar-fill').css("width", (100*percentage) + "%");
		if (amount < 0) {
			$(".bar").animate({
				backgroundColor: "rgba(255,51,51,.85)"
				}, 200, function() {
					$(".bar").animate({
						backgroundColor: "rgba(0,51,51,.1)"
						}, 400, function() {
					});
			});
		} else if (amount > 0) {
			$(".bar").animate({
				backgroundColor: "rgba(51,255,255,.85)"
				}, 200, function() {
					$(".bar").animate({
						backgroundColor: "rgba(0,51,51,.1)"
						}, 800, function() {
					});
			});
		}
	}
	
	// Update HP
	function updateHP(amount) {
		CURRENT_HP += amount;
		
		// error checking
		if (CURRENT_HP <= 0) {
			CURRENT_HP = 0;
		}
		if (CURRENT_HP >= MAX_HP) {
			CURRENT_HP = MAX_HP;
		}
		
		$(".hp").html("<span>HP</span> " + CURRENT_HP + " / " + MAX_HP);
		
		updateBar(amount);
	}
	
	// Update item inventory
	function updateItems(elementId) {
		var update = true;
		if (elementId == "potion") {
			if (items[0].count <= 0) {
				items[0].count = 0;
				update = false;
			} else {
				var amount = Math.ceil(0.15 * MAX_HP);
				updateHP(amount);
				items[0].count -= 1;
				if (items[0].count <= 0) { update = false; }
				var quantity = " You have <b>" + items[0].count + " Potion(s) remaining</b>."
				$(".item-description").html(items[0].description + quantity);
			}
			$('#item1 .item-count').text("x" + items[0].count);
		} else if (elementId == "super-potion") {
			if (items[1].count <= 0) {
				items[1].count = 0;
				update = false;
			} else {
				var amount = Math.ceil(0.25 * MAX_HP);
				updateHP(amount);
				items[1].count -= 1;
				if (items[1].count <= 0) { update = false; }
				var quantity = " You have <b>" + items[1].count + " Super Potion(s) remaining</b>."
				$(".item-description").html(items[1].description + quantity);
			}
			$('#item2 .item-count').text("x" + items[1].count);
		} else if (elementId == "hyper-potion") {
			if (items[2].count <= 0) {
				items[2].count = 0;
				update = false;
			} else {
				var amount = Math.ceil(0.4 * MAX_HP);
				updateHP(amount);
				items[2].count -= 1;
				if (items[2].count <= 0) { update = false; }
				var quantity = " You have <b>" + items[2].count + " Hyper Potion(s) remaining</b>."
				$(".item-description").html(items[2].description + quantity);
			}
			$('#item3 .item-count').text("x" + items[2].count);
		} else if (elementId == "max-potion") {
			if (items[3].count <= 0) {
				items[3].count = 0;
				update = false;
			} else {
				var amount = Math.ceil(MAX_HP);
				updateHP(amount);
				items[3].count -= 1;
				if (items[3].count <= 0) { update = false; }
				var quantity = " You have <b>" + items[3].count + " Max Potion(s) remaining</b>."
				$(".item-description").html(items[3].description + quantity);
			}
			$('#item4 .item-count').text("x" + items[3].count);
		}
		
		// Disable item if count is zero
		$('.item').each(function( i ) {
			var count = $(this).find('.item-count').text();
			if (count == "x0") {
				$(this).addClass("disabled");
			}
		});
		
		return update;
	}
	
	// Get the image
	function getImage(index) {
		var imgSrc = "";
		if (index < 10) {
			imgSrc = "00" + index;
		} else if (index >= 10 && index < 100) {
			imgSrc = "0" + index;
		} else {
			imgSrc = index;
		}
		return imgSrc;
	}
	
	// Show image
	function showImage(src) {
		if (src == "") {
			var index = order[CURRENT_QNUM-1];
			imgSrc = "img/" + getImage(index) + ".png";
		} else {
			imgSrc = src;
		}
		$('.card-img').fadeOut(400);
		$('.card-img').promise().done(function() {
			$('.card-img').removeClass("x-small");
			$('.card-img').removeClass("small");
			$('.card-img').removeClass("medium");
			$('.card-img').removeClass("large");
			$('.card-img').removeClass("x-large");
			$('.card-img').removeClass("card-img-left");
			$('.card-img').removeClass("card-img-right");
			
			var index = order[CURRENT_QNUM-1]-1;
			if (CURRENT_QNUM <= NUM_QUESTIONS && CURRENT_HP > 0) {
				$('#img1').addClass(questions[index].size);
				
				if (index == 24) { // Pikachu and Pichu
					$('#img1').addClass("card-img-right");
					$('#img2').addClass("x-small");
					$('#img2').addClass("card-img-left");
					$('#img2').attr({"src": "img/172.png", "alt": "Pichu"});
					$('#img2').delay(200).fadeIn(400);
				}
					
				$('#img1').attr({"src": imgSrc, "alt": questions[index].name});
				$('#img1').delay(200).fadeIn(400);
			} else {
				$('.card-img').addClass("medium");
				$('.card-img').tooltip("destroy");
				$('.card-img').unbind('mouseenter mouseleave');
			
				$('#img1').attr({"src": imgSrc});
				$('#img1').delay(200).fadeIn(400);
			}
		});
	}
	
	// Show image tooltip
	function showImageTooltip() {
		if (!CURRENT_QNUM == 0) {
			var index = order[CURRENT_QNUM-1]-1;
			
			var name = questions[index].name;
			var min = Math.round(questions[index].minDamage * DIFFICULTY);
			var max = Math.round(questions[index].maxDamage * DIFFICULTY);
			
			$('#header1').text(name);
			$('#data1').text(min + "-" + max);
		}
	}
	
	// On tooltip hover
	$('.card-img').hover(function() {
		if ($(this).attr("alt") == "Pichu") {
			var min = Math.round(18 * DIFFICULTY);
			var max = Math.round(21 * DIFFICULTY);
			$('#header2').text("Pichu");
			$('#data2').text(min + "-" + max);
		} else {
			showImageTooltip();
		}
	});
	
	// Adjust placement of tooltip based on window width
	function adjustTooltipPlacement() {	
		if (window.innerWidth <= 544) {
			$('#img1').data('bs.tooltip').options.placement = 'top';
			$('#img2').data('bs.tooltip').options.placement = 'top';
		} else {
			$('#img1').data('bs.tooltip').options.placement = 'right';
			$('#img2').data('bs.tooltip').options.placement = 'left';
		}
	}
	
	// Display the question.
	function showQuestion(curQuestion) {
		$('#question').delay(400).hide(400);
		
		$( "#question" ).promise().done(function() {
			$('#question').html(curQuestion);
			$('#question').slideDown(400);
			$('.counter h1').html(CURRENT_QNUM + " / " + NUM_QUESTIONS);
		});
	}
	
	// Display the multiple choice answers.
	function showAnswers(curAnswers) {
		var numAnswers = curAnswers.length;
		
		// Hide the list of previous answers
		$( ".answer" ).children('p').each(function( i ) {
			$(this).animate({
				opacity: "0"
			}, 400, function() {
				$(this).text(" ");
			});
		});
		
		setTimeout(function() {
			$(".answer").animate({
				width: "16em"
				}, 400, function() {
			});
			
			// Shuffle the list of current answers in array.
			shuffle(curAnswers); //.sort(function() { return 0.5 - Math.random() });
			
			// Update and then display the current answers
			$( ".answer" ).promise().done(function() {
				setTimeout(function() {
					for (var i = 0; i < numAnswers; i++) {
						var parent = "#a" + (i + 1);
						var textElement = "#a" + (i + 1) + " p";
						$(textElement).text(curAnswers[i].answer);
						$(textElement).animate({
							opacity: "1"
							}, 400, function() {
						});
						$(parent).attr("title",curAnswers[i].answer);
					}
				}, 300);
				
				$( ".answer" ).each(function( i ) {
					$(this).animate({
						width: '100%'
						}, 400, function() {
					});
				});
			});
		}, 500);
	}
	
	// Grab next question.
	function nextQuestion() {
		if (CURRENT_QNUM <= NUM_QUESTIONS) {
			var index = order[CURRENT_QNUM-1]-1;
			return questions[index].question;
		} else {
			return "";
		}
	}
	
	// Grab next set of answers.
	function nextAnswers() {
		if (CURRENT_QNUM <= NUM_QUESTIONS) {
			var index = order[CURRENT_QNUM-1]-1;
			return answers[index];
		} else {
			return "";
		}
	}
	
	// Show results
	function showResults(text) {
		$('#question').hide(400);
		
		// Show results heading
		$( "#question" ).promise().done(function() {
			$('#question').text(text);
			$('#question').slideDown(400);
			
			// Show results
				$(".answer").animate({
					width: "16em",
					opacity: "0"
					}, 400, function() {
						if (CURRENT_HP > 0) {
							$('.results h1').text(NUM_CORRECT + " / " + NUM_QUESTIONS);
						} else {
							$('.results h1').text(NUM_CORRECT + " / " + (CURRENT_QNUM-1));
						}
						$('.results').fadeIn(400);
						$(this).hide();
				});
		});
		
		// Hide nav
		$('.navbar-toggle').animate({
			bottom: "-100vh"
		}, 800, "swing", function() {
		});
	}
	
	// Get medal
	function getMedal() {
		var bronze = Math.round(NUM_QUESTIONS * .70);
		var silver = Math.round(NUM_QUESTIONS * .90);
		var gold = Math.round(NUM_QUESTIONS * 1);
		
		if (NUM_CORRECT < bronze) {
			return "img/pogo-bronze-medal.png";
		} else if (NUM_CORRECT < silver) {
			return "img/pogo-silver-medal.png";
		} else if (NUM_CORRECT <= gold) {
			return "img/pogo-gold-medal.png";
		}
	}
	
	// Display next Q&A when an answer is clicked.
	function nextQandA() {
		CURRENT_QNUM += 1;
		var curQuestion = nextQuestion();
		var curAnswers = nextAnswers();
		
		// If no questions are left, display results. Else, display next Q&A.
 		if (CURRENT_HP == 0) {
			showResults("Game Over");
			showImage("img/pogo-revive.png");
			// hide nav
			$('.navbar-toggle').animate({
				bottom: "-100vh"
			}, 800, "swing", function() {
			});
			$('.collapse').collapse('hide');
		} else if (curQuestion == "") {
			showResults("Results");
			
			// Medals
			var medalImage = getMedal();
			showImage(medalImage);
			
		} else {
			// Enable navbar toggle
			$('.navbar-toggle').attr("data-toggle", "collapse");
			
			// Reallow click event for answers
			FLAG_ACTION = false;
			
			showQuestion(curQuestion);
			showAnswers(curAnswers);
			showImage("");
		} 
	};
	
	// Get answer object from id
	function getAnswer(answerId) {
		var index = order[CURRENT_QNUM-1]-1;
		var answer = answers[index][answerId];
		return answer;
	}
	
	// Check if answer chosen is correct
	function checkAnswer(answer) {
		return answer.isCorrect;
	}
	
	// Utility function to get a random interger between two integer values
	function randomIntFromInterval(min,max) {
		return Math.floor(Math.random()*(max-min+1)+min);
	}
	
	// Calculate damage
	function calcDamage(answer) {
		var index = order[CURRENT_QNUM-1]-1;
		var min = Math.round(questions[index].minDamage * DIFFICULTY);
		var max = Math.round(questions[index].maxDamage * DIFFICULTY);
		var difference = max - min;
		var percentMin = answer.reward - 20;
		var percentMax = answer.reward + 20;
		var percent = randomIntFromInterval(percentMin,percentMax);
		var offset = Math.round(-1*(percent / 100) * difference);
		var damage = -1 * (min + offset);
		
		return damage;
	}
	
	// Update QP and HP based on answer chosen
	function updateStats(answer, isCorrect) {
		var index = order[CURRENT_QNUM-1]-1;
		if (isCorrect) {
			var reward = answer.reward * DIFFICULTY;
			if (index == 24) { // Pichu
				reward += (34 * DIFFICULTY);
			}
			updateQP(reward);
			NUM_CORRECT += 1;
			return reward;
		} else {
			// Calculate damage
			var damage = calcDamage(answer);
			if (index == 24) { // Pichu
				damage += (-21 * DIFFICULTY);
			}
			updateHP(damage);
			return damage;
		}
	}
	
	// Show QP reward or HP punishment after answer is chosen
	function showReward(element, answer, isCorrect) {
		var statElement = element.find(".answer-stat");
		var amount = updateStats(answer, isCorrect);

		// Disable nav while updating stat
		$('.navbar-toggle').removeAttr('data-toggle');
		
		if (isCorrect) {
			element.addClass("correct");
			statElement.text("+" + amount + " QP");
			statElement.css("color","rgb(25,204,230)");
			statElement.animate({
				opacity: "1",
				top: "-.75em"
			}, {
				duration: 200,
				complete: function() {
					$(this).delay(800).fadeOut(400).delay(200);
					$(this).promise().done(function() {
						element.removeClass("correct");
						$(this).removeAttr('style');
						nextQandA();
					});
				}
			});
		} else {
			element.addClass("incorrect");
			statElement.text(amount + " HP");
			statElement.css("color","rgb(255,127,127)");
			statElement.animate({
				opacity: "1",
				top: "-.75em"
			}, {
				duration: 200,
				complete: function() {
					$(this).delay(800).fadeOut(400).delay(200);
					$(this).promise().done(function() {
						element.removeClass("incorrect");
						$(this).removeAttr('style');
						nextQandA();
					});
				}
			});
		}
	}
	
	// Check clicked answer, update stats, show next question
	$('.answer,.answer span,.answer p').click( function(e) {
		var target;
		var answer;
		var isCorrect;
		
		e.stopPropagation();
		
		if (FLAG_ACTION) { return; } // prevent further action
		else {
			FLAG_ACTION = true;
		}
		
		if ($(this).hasClass("a1")) {
			answer = getAnswer(0);
			target = $('.a1');
		} else if ($(this).hasClass("a2")) {
			answer = getAnswer(1);
			target = $('.a2');
		} else if ($(this).hasClass("a3")) {
			answer = getAnswer(2);
			target = $('.a3');
		} else if ($(this).hasClass("a4")) {
			answer = getAnswer(3);
			target = $('.a4');
		}
		
		// check answer
		var isCorrect = checkAnswer(answer);
		// update stats and show rewards
		showReward(target, answer, isCorrect);
	});

});
