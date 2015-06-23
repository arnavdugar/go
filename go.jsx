board_width = 700;
board_height = 700;
grid_size = 8;

var Board = React.createClass({
    getInitialState: function() {
        var state = {};
        for(var i = 0; i < grid_size * grid_size; i++) {
            state[i] = 0;
        }
        return state;
    },
    render: function() {
        var pieces = [];
        for(var x = 0; x < grid_size; x++) {
            for(var y = 0; y < grid_size; y++) {
                var index = grid_size * y + x;
                if(this.state[index] == 0) {
                    var color = "none";
                } else if(this.state[index] == 1) {
                    var color = "white";
                } else if(this.state[index] == 2) {
                    var color = "black";
                }
                pieces.push(<Piece key={"p" + index} x={x} y={y} color={color}
                    onClickHandler={this.onPieceClick}/>);
            }
        }
        var lines = [];
        for(var i = 0; i < grid_size; i++) {
            var y = board_width * (i + 0.5) / grid_size;
            var x_start = 0.5 * board_width/grid_size;
            var x_end = board_width * (1 - 0.5 / grid_size);
            lines.push(<line key={"y" + i} className="grid" x1={x_start} x2={x_end} y1={y} y2={y}/>);
        }
        for(var i = 0; i < grid_size; i++) {
            var x = board_height * (i + 0.5) / grid_size;
            var y_start = 0.5 * board_height/grid_size;
            var y_end = board_height * (1 - 0.5 / grid_size);
            lines.push(<line key={"x" + i} className="grid" x1={x} x2={x} y1={y_start} y2={y_end}/>);
        }
        return (
            <svg className="board" height={board_width} width={board_height}>
                {lines}{pieces}
            </svg>
        );
    },
    onPieceClick: function(x, y) {
        console.log(x, y)
        var index = y * grid_size + x;
        this.setState(function(previousState, currentProps) {
            var obj = {};
            obj[index] = (previousState[index] + 1) % 3;
            return obj;
        });
    }
});

var Piece = React.createClass({
    render: function() {
        var x = board_width * (this.props.x + 0.5) / grid_size;
        var y = board_width * (this.props.y + 0.5) / grid_size;
        var r = Math.round(0.9 * board_width / (2 * grid_size + 2));
        return (<circle className={"piece " + this.props.color} cx={x} cy={y} r={r}
            onClick={this.props.onClickHandler.bind(null, this.props.x, this.props.y)}></circle>);
    }
});

React.render(<Board/>, document.getElementById('content'));

