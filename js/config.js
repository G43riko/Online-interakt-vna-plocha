const LEFT_BUTTON 	= 0;
const RIGHT_BUTTON 	= 2;
const SHIFT_KEY 	= 16;
const L_CTRL_KEY 	= 17;
const L_ALT_KEY 	= 18;
const ESCAPE_KEY 	= 27;
const ENTER_KEY 	= 13;
const Z_KEY 		= 90;
const Y_KEY 		= 89;

const FONT_HALIGN_LEFT		= "left";
const FONT_HALIGN_CENTER	= "center";
const FONT_HALIGN_RIGHT		= "right";

const FONT_VALIGN_MIDDLE	= "middle";
const FONT_VALIGN_TOP		= "top";
const FONT_VALIGN_ALPHA		= "alphabetic";
const FONT_VALIGN_HANG		= "hanging";
const FONT_VALIGN_IDEO		= "ideographic";
const FONT_VALIGN_BOTT		= "bottom";

const FONT_ALIGN_CENTER = 10;
const FONT_ALIGN_NORMAL = 11;

const SELECTOR_SIZE 	= 10;
const SELECTOR_COLOR	= "orange";

const LINE_CAP_BUTT 	= "butt";
const LINE_CAP_ROUND 	= "round";
const LINE_CAP_SQUARE 	= "square";

const LINE_JOIN_MITER	= "miter";
const LINE_JOIN_ROUND	= "round";
const LINE_JOIN_BEVEL	= "bevel";


const OPERATION_DRAW_RECT 	= 1000;
const OPERATION_DRAW_ARC	= 1001;
const OPERATION_DRAW_PATH	= 1002;
const OPERATION_DRAW_LINE	= 1003;
const OPERATION_DRAW_JOIN	= 1004;
const OPERATION_DRAW_IMAGE	= 1005;

const JOIN_LINEAR		= 2000;
const JOIN_BAZIER		= 2001;
const JOIN_SEQUENCAL	= 2002;

const LINE_STYLE_NORMAL		= 2100;
const LINE_STYLE_STRIPPED	= 2101;
const LINE_STYLE_FILLED		= 2102;

const DEFAULT_BACKGROUND_COLOR	= "WHITE";
/*R*/const DEFAULT_FONT				= "Comic Sans MS";
const DEFAULT_FONT_SIZE			= 22;
const DEFAULT_FONT_COLOR		= "#000000";
const DEFAULT_SHADOW_COLOR		= "#000000";
const DEFAULT_SHADOW_BLUR		= 20;
const DEFAULT_SHADOW_OFFSET		= 5;
/*D*/const DEFAUL_STROKE_COLOR		= "#000000";
/*D*/const DEFAULT_STROKE_WIDTH		= 2;
/*D*/const DEFAULT_COLOR				= "#000000";
const DEFAULT_FILL_COLOR		= "#000000";
const DEFAULT_RADIUS			= 5;
const DEFAULT_TEXT_OFFSET		= 5;
const DEFAULT_FONT_HALIGN		= FONT_HALIGN_LEFT;
const DEFAULT_FONT_VALIGN		= FONT_VALIGN_TOP;
/*D*/const DEFAULT_ROUND_VAL			= 10;
const DEFAULT_BORDER_COLOR		= "BLACK";
const DEFAULT_BORDER_WIDTH		= 2;
const DEFAULT_LINE_TYPE			= JOIN_LINEAR;
const DEFAULT_LINE_STYLE		= LINE_STYLE_NORMAL;
const DEFAULT_BRUSH_SIZE		= 20;
const DEFAULT_BRUSH_TYPE 		= "brush1.png";
const DEFAULT_BRUSH_COLOR 		= "black";

const CONTEXT_MENU_LINE_HEIGHT 	= 40;
const CONTEXT_MENU_FONT_COLOR 	= DEFAULT_FONT_COLOR;
const CONTEXT_MENU_OFFSET 		= 10;
const CONTEXT_MENU_WIDTH 		= 240;

const TOUCH_DURATION 	= 500;
const TOUCH_VARIATION 	= 5;

const MENU_OFFSET 		= 10;//20
const MENU_RADIUS		= 10;
const MENU_BORDER_WIDTH = 2;
const MENU_FONT_COLOR 	= 2;
const MENU_BORDER_COLOR = "#000000";
const MENU_WIDTH 		= 50;//60
const MENU_HEIGHT 		= 50;//60
const MENU_POSITION 	= MENU_OFFSET;

const TABLE_BORDER_WIDTH 	= 1;
const TABLE_HEADER_COLOR 	= "#53CFFF";
const TABLE_BODY_COLOR		= "#5BF2FF";
const TABLE_LINE_HEIGHT		= 40;
const TABLE_BORDER_COLOR	= "#000000";
const TABLE_WIDTH 			= 300;
const TABLE_RADIUS 			= 10;
const TABLE_TEXT_OFFSET		= 5;

/*R*/const PI2 = Math.PI * 2;

/*R*/const PUBLIC_ACCESS 	= "+";
/*R*/const PRIVATE_ACCESS 	= "-";
/*R*/const PROTECTED_ACCESS 	= "#";

const ACTION_OBJECT_MOVE 		= 2310;
const ACTION_OBJECT_CREATE		= 2311;
const ACTION_OBJECT_CHANGE		= 2312;
const ACTION_OBJECT_DELETE		= 2313;
const ACTION_PAINT_CLEAN		= 2314;
const ACTION_PAINT_ADD_POINT	= 2315;
const ACTION_PAINT_BREAK_LINE	= 2316;
const ACTION_PAINT_CHANGE_BRUSH	= 2317;

const PAINT_ACTION_BRUSH	= 2400;
const PAINT_ACTION_LINE		= 2401;

const KEYWORD_TRANSPARENT	= "transparent";

const IMAGE_FORMAT_JPG = "image/jpeg";
const IMAGE_FORMAT_PNG = "image/png";
const IMAGE_FORMAT_GIF = "image/gif";

const LOGGER_MENU_CLICK 		= 2600;
const LOGGER_CREATOR_CHANGE 	= 2601;
const LOGGER_CONTEXT_CLICK		= 2602;
const LOGGER_LAYER_CHANGE		= 2603;
const LOGGER_OBJECT_CREATED		= 2604;
const LOGGER_OBJECT_ADDED		= 2605;
const LOGGER_COMPONENT_CREATE	= 2606;