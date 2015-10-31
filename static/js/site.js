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
        $(element).datepicker().on('changeDate', function(e) {
        	// console.log(this, e);
        	// return true;
	    });
    },
    update: function (element, valueAccessor, allBindings, viewModel, bindingContext) {

    }
};

function Activity (data) {
	var that = this;
	this.name = ko.observable(data ? data.name : '');
	this.date = ko.observable(data ? data.date : '');
	this.duration = ko.observable(data ? data.duration : '');
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
    saveActivity: function(data, event){
    	console.log('saving activity');
    	$('.status').text('новая запись');
    	m_site.currentActivity(new Activity({name:'', date:'', duration:'', milestones:['']}))
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


    	if (from && to) {
    		data = {
    			from: from,
    			to: to
    		}
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
    	activities = [
    		{
    			name: '1',
    			date: moment().add(1, 'd').toISOString(),
    			milestones: [],
    			duration: '1 eternity'
    		},
    		{
    			name: '2',
    			date: moment().add(1, 'd').toISOString(),
    			milestones: [],
    			duration: '1 eternity'
    		},
    		{
    			name: '3',
    			date: moment().subtract(1, 'd').toISOString(),
    			milestones: [],
    			duration: '1 eternity'
    		},
    		{
    			name: '4',
    			date: moment().subtract(1, 'd').toISOString(),
    			milestones: [],
    			duration: '1 eternity'
    		},
    		{
    			name: '5',
    			date: moment().add(2, 'd').toISOString(),
    			milestones: [],
    			duration: '1 eternity'
    		},
    		{
    			name: '6',
    			date: moment().add(3, 'd').toISOString(),
    			milestones: [],
    			duration: '1 eternity'
    		},
    		{
    			name: '7',
    			date: moment().add(3, 'd').toISOString(),
    			milestones: [],
    			duration: '1 eternity'
    		},
		];

    	activities.sort(function(a, b) { 
    	    return a.date > b.date;
    	});

    	var curr = moment(activities[0].date).locale('ru-ru').startOf("week");
    	var end = moment(activities[activities.length-1].date).locale('ru-ru').endOf("week");
    	var weeks = [];
    	var days = [];
    	while (curr <= end) {
    		days.push({
    			date: curr.format('DD MM YYYY'),
    			activities:	activities.filter(function( obj ) {
    				console.log(curr.diff( moment(obj.date), 'days' ));
    		    	return curr.diff( moment(obj.date), 'days' ) == 0;
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
    	//sort activities by days
    	//sort days by week
    	//populate calendar.weeks
    },
    saveActivity: function(activities){
    	data = ko.toJS(m_site.currentActivity());
    	console.log(data);

    	$.ajax({
            url: '/api/activitity' + data._id ? '/'+data._id : '',
            cache: false,
            method: 'post',
            success: function(data) {
            	if (data.err) {
            		console.log(data.err)
            	} else {
	                m_site.mapActivities(data);
	                window.location.reload();
            	}
            }
        });
    }

}

$(document).ready(function() {
    ko.applyBindings(m_site);
    m_site.init(function(err){
    	if (!err) {
    		m_site.loadCalendar();
    	} else {
		    $("#loginModal").modal({backdrop: 'static', keyboard: false});
    	}
    });
});