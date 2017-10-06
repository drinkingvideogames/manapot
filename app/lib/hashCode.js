export default function hashCode (str) {
    var hash = 0
    if (!str) return hash
    for (var i = 0; i < str.length; i++) {
       hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
}
