var SPECIAL_CHARACTERS = ['.', ' ', '/', '!', '"','”','“', '#', '$', '%',
    '*', '+', ',', ':', '<', '=', '>', '?', '@', '[', '\\', ']', '^',
    '`', '|', '~',
    'a', 'á', 'à', 'ả', 'ã', 'ạ',
    'â', 'ấ', 'ầ', 'ẩ', 'ẫ', 'ậ',
    'ă', 'ắ', 'ằ', 'ẳ', 'ẵ', 'ặ',

    'đ',

    'e', 'é', 'è', 'ẻ', 'ẽ', 'ẹ',
    'ê', 'ế', 'ề', 'ể', 'ễ', 'ệ',

    'i', 'í', 'ì', 'ỉ', 'ĩ', 'ị',

    'o', 'ó', 'ò', 'ỏ', 'õ', 'ọ',
    'ô', 'ố', 'ồ', 'ổ', 'ỗ', 'ộ',
    'ơ', 'ớ', 'ờ', 'ở', 'ỡ', 'ợ',

    'u', 'ú', 'ù', 'ủ', 'ũ', 'ụ',
    'ư', 'ứ', 'ừ', 'ử', 'ữ', 'ự',

    'y', 'ý', 'ỳ', 'ỷ', 'ỹ', 'ỵ',
    '\'', '`', '&', '(', ')', '{',
    '}', ';'];


var REPLACEMENTS = ['', '-', '', '', '', '', '','', '', '',
    '', '_', '', '_', '', '', '', '', '', '', '_',
    '', '', '', '', '',
    'a', 'a', 'a', 'a', 'a', 'a',
    'a', 'a', 'a', 'a', 'a', 'a',
    'a', 'a', 'a', 'a', 'a', 'a',

    'd',

    'e', 'e', 'e', 'e', 'e', 'e',
    'e', 'e', 'e', 'e', 'e', 'e',

    'i', 'i', 'i', 'i', 'i', 'i',

    'o', 'o', 'o', 'o', 'o', 'o',
    'o', 'o', 'o', 'o', 'o', 'o',
    'o', 'o', 'o', 'o', 'o', 'o',

    'u', 'u', 'u', 'u', 'u', 'u',
    'u', 'u', 'u', 'u', 'u', 'u',

    'y', 'y', 'y', 'y', 'y', 'y',
    '', '', '-', '-', '-', '-',
    '-', '-'];

exports.toURLFriendly = function(s) {
  if (!s) return 'empty';

  // Convert to lowercase.
  var invalidCharRegex = /[^a-zA-Z0-9-_]/g;
  var duplicateDashRegex = /[-]+/g;

  // Add limit to result string
  var maxLength = Math.min(s.length, 100);

  // Result

  var result = 
    s.toLowerCase()
    .split("") // convert string to array
    .slice(0, maxLength) // limit maxLength elemements
    .map(function(char) { // convert Special Char to Normal Char
      index = SPECIAL_CHARACTERS.indexOf(char);
      return index >= 0 ? REPLACEMENTS[index] : char;
    })
    .join(""); // convert array to string

  result = result
    .replace(invalidCharRegex, '-')
    .replace(duplicateDashRegex, '-')
    .replace(/-+$/, '');

  // Delete any trailing '-'

  return result;
};
