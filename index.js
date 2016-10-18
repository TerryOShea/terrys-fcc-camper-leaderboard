'use strict';

$(document).ready(function () {

  //the category row scrolls with the window
  $(window).scroll(function () {
    var $catRow = $('.category-row'),
        $firstRow = $('.row:first-child');

    //222 is the height of the header plus margin plus border.
    //The first row becomes taller; otherwise the category row
    //would cover it
    if ($(window).scrollTop() > 222) {
      $catRow.addClass('category-scroll');
      $firstRow.css('height', '120px');
    } else {
      $catRow.removeClass('category-scroll');
      $firstRow.css('height', '60px');
    }
  });

  var Header = React.createClass({
    displayName: 'Header',

    render: function render() {
      return React.createElement(
        'header',
        null,
        React.createElement('img', { id: 'logo', 
          src: 'http://metakata.altervista.org/wordpress/wp-content/uploads/2015/08/freecodecamp_white.png' }),
        React.createElement(
          'h1',
          null,
          'Leaderboard'
        )
      );
    }
  });

  //the camper's position appears next to the name when hovered
  var Row = React.createClass({
    displayName: 'Row',

    render: function render() {
      return React.createElement(
        'div',
        { className: 'row' },
        React.createElement(
          'div',
          { className: 'col-xs-6 col-sm-4' },
          React.createElement(
            'a',
            { href: 'https://www.freecodecamp.com/' + this.props.name, target: '_blank' },
            this.props.name
          ),
          React.createElement(
            'span',
            { className: 'position' },
            ' (#' + this.props.index + ')'
          )
        ),
        React.createElement(
          'div',
          { className: 'col-xs-3 col-sm-4' },
          this.props.monthScore
        ),
        React.createElement(
          'div',
          { className: 'col-xs-3 col-sm-4' },
          this.props.total
        )
      );
    }
  });

  //the category row at the top
  var CatRow = React.createClass({
    displayName: 'CatRow',

    render: function render() {
      return React.createElement(
        'div',
        { className: 'row category-row' },
        React.createElement(
          'div',
          { className: 'col-xs-6 col-sm-4' },
          'Name'
        ),
        React.createElement(
          'div',
          { className: 'col-xs-3 col-sm-4' },
          React.createElement(
            'span',
            { className: 'hideme' },
            'Last '
          ),
          '30',
          React.createElement(
            'span',
            { className: 'hideme' },
            ' Days'
          ),
          '   ',
          React.createElement(SortIcon, { sortedCol: this.props.column, currCol: '30-day', onClick: this.props.changeColumn })
        ),
        React.createElement(
          'div',
          { className: 'col-xs-3 col-sm-4' },
          'All ',
          React.createElement(
            'span',
            { className: 'hideme' },
            'Time '
          ),
          '   ',
          React.createElement(SortIcon, { sortedCol: this.props.column, currCol: 'Total', onClick: this.props.changeColumn })
        )
      );
    }
  });

  //the icons let you toggle between most points in the past
  //30 days and most points ever
  var SortIcon = React.createClass({
    displayName: 'SortIcon',

    render: function render() {
      return React.createElement('i', { className: 'fa fa-lg ' + (this.props.sortedCol === this.props.currCol ? 'fa-caret-down' : 
        'fa-caret-right'), onClick: this.props.onClick });
    }
  });

  var CampersList = React.createClass({
    displayName: 'CampersList',

    render: function render() {
      var list = this.props.list.map(function (item, index) {
        return React.createElement(Row, { name: item.username, monthScore: item.recent, total: item.alltime, index: index + 1 });
      });
      return React.createElement(
        'div',
        null,
        list
      );
    }
  });

  var Leaderboard = React.createClass({
    displayName: 'Leaderboard',

    getInitialState: function getInitialState() {
      return {
        campers30: [],
        campersall: [],
        column: "30-day"
      };
    },

    //switch from top campers over the past 30 days
    //to top campers of all time
    changeColumn: function changeColumn() {
      var newcol = this.state.column == '30-day' ? 'Total' : '30-day';
      this.setState({ column: newcol });
    },

    componentDidMount: function componentDidMount() {
      $.getJSON('https://fcctop100.herokuapp.com/api/fccusers/top/recent', function (response) {
        this.setState({ campers30: response });
      }.bind(this));
      $.getJSON('https://fcctop100.herokuapp.com/api/fccusers/top/alltime', function (response) {
        this.setState({ campersall: response });
      }.bind(this));
    },

    render: function render() {
      return React.createElement(
        'div',
        { className: 'wrap' },
        React.createElement(Header, null),
        React.createElement(CatRow, { column: this.state.column, changeColumn: this.changeColumn }),
        React.createElement(CampersList, { list: this.state.column === '30-day' ? this.state.campers30 : this.state.campersall })
      );
    }
  });

  ReactDOM.render(React.createElement(Leaderboard, null), document.getElementById('content'));
});