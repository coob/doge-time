calendar = {
	weeks: [
		[
			{
				date: '10.10.10',
				activities: [new Activity({name:'123', date:'qqq', duration:'1h', milestones:['m1','m2']}),new Activity({name:'qwerty', date:'now', duration:'2h', milestones:['m21','m22']})],
			}
		]
	],
	from: 'date',
	to: 'eternity'
}

ko.bindingHandlers.datePicker = {
    init: function (element, valueAccessor, allBindingsAccessor) {
        $(element).datepicker({format: 'dd/mm/yyyy'}).on('changeDate', function(e) {
        	m_site.currentActivity().date(e.date)
        	// console.log(this, e);
        	// return true;
	    });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

function Activity (data) {
	var that = this;
	this._id = ko.observable(data && data._id ? data._id : null);
	this.name = ko.observable(data && data.name ? data.name : '');
	this.date = ko.observable(data && data.date ? data.date : new Date);
	this.duration = ko.observable(data && data.duration ? data.duration : '');
	this.milestones = ko.observableArray();
	data.milestones.forEach(function(el){
		that.milestones.push(ko.observable(el ? el : ''));
	});
}

m_site = {
	me: ko.observable({email:'vanusha'}),
	loginForm: {
		email: ko.observable(''),
		password: ko.observable('')
	},
	registrationForm: {
		email: ko.observable(''),
		password: ko.observable('')
	},
	calendar: ko.observable(calendar),
	currentActivity: ko.observable(new Activity({name:'', date:'', duration:'', milestones:['']})),

	setCurrentActivity: function(data, event){
		m_site.currentActivity(data);
		$('.status').text('редактирование записи')
	},
	addMilestone: function(data, event){
		m_site.currentActivity().milestones.push('');
	},
	removeMilestone: function(data, event) {
        m_site.currentActivity().milestones.remove(data);
    },
    login: function(){
    	$('#loginModal .error-message').hide();
    	if(true){
    		$('#loginModal').modal('hide')
    	} else {
	    	$('#loginModal .error-message').show();
    	}
    },
    signup: function(){
    	$('#signupModal .error-message').hide();
    	if(true){
    		$('#signupModal').modal('hide');
    		$("#loginModal").modal('show');
    	} else {
	    	$('#signupModal .error-message').show();
    	}
    },
    init: function(done) {
        $.ajax({
            url: '/api/init',
            cache: false,
            method: 'get',
            success: function(data) {
            	if (data.err) {
            		done(data.err);
            	} else {
	                m_site.me(data.user);
	                done(null);
            	}
            }
        });
    },
    loadCalendar: function(from, to) {
    	var data = {}
    	if (from) {
    		data.from = from
    	}
    	if (to) {
    		data.to = to
    	}

    	$.ajax({
            url: '/api/activities',
            cache: false,
            method: 'get',
            data: data,
            success: function(data) {
            	if (data.err) {
            		console.log(data.err)
            		// done(data.err);
            	} else {
	                m_site.mapActivities(data);
	                // done(null);
            	}
            }
        });
    },
    mapActivities: function(activities){
  
      	activities.sort(function(a, b) { 
    	    return a.date > b.date;
    	});

    	activities = $.map( activities, function( val, i ) {
    	    return new Activity(val);
    	});


    	var curr = moment(activities[0].date()).locale('ru-ru').startOf("week");
    	var end = moment(activities[activities.length-1].date()).locale('ru-ru').endOf("week");
    	var weeks = [];
    	var days = [];
    	while (curr <= end) {
    		days.push({
    			date: curr.format('DD MM YYYY'),
    			activities:	activities.filter(function( obj ) {
    		    	return curr.format('DD MM YYYY') == moment(obj.date()).format('DD MM YYYY');
    			})
    		});
    	    curr.add(1, 'd')
    	    if (days.length == 7) {
    	    	weeks.push(days);
    	    	days = [];
    	    }
    	}
    	m_site.calendar({
    		weeks: weeks,
    		from: '1',
    		to: '2'
    	});
    },
    saveActivity: function(){
    	data = ko.toJS(m_site.currentActivity());
    	data.milestones = [';(']
    	data.date = moment(data.date).toISOString();
    	url = '/api/activity' + (data._id ? '/'+data._id : '');
    	console.log(data);
    	// return true;

    	$.ajax({
            url: url,
            cache: false,
            method: 'post',
            dataType: 'json',
            contentType: 'application/json; charset=utf-8',
            data: JSON.stringify(data),
            success: function(data) {
            	if (data.err) {
            		console.log(data.err)
            	} else {
	                // m_site.mapActivities(data);
	                window.location.reload();
            	}
            }
        });
    },
    deleteActivity: function(){
    	data = ko.toJS(m_site.currentActivity());
    	if (data._id) {
	    	url = '/api/activity' + '/' + data._id;

	    	$.ajax({
	            url: url,
	            cache: false,
	            method: 'delete',
	            success: function(data) {
	            	if (data.err) {
	            		console.log(data.err)
	            	} else {
		                // m_site.mapActivities(data);
		                window.location.reload();
	            	}
	            }
	        });
    	}
    }

}

$(document).ready(function() {
    ko.applyBindings(m_site);
    		m_site.loadCalendar();
    m_site.init(function(err){
    	if (!err) {
    	} else {
		    $("#loginModal").modal({backdrop: 'static', keyboard: false});
    	}
    });
});