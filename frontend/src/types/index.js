// Type definitions for Моє Містечко

/**
 * @typedef {Object} User
 * @property {string} user_id
 * @property {string} email
 * @property {string} name
 * @property {string} [picture]
 * @property {'superadmin'|'admin'|'moderator'|'user'} role
 * @property {'rada1'|'rada2'} [rada]
 */

/**
 * @typedef {Object} NewsItem
 * @property {string} id
 * @property {string} title
 * @property {string} content
 * @property {string} excerpt
 * @property {string} [image]
 * @property {string} category
 * @property {'all'|'rada1'|'rada2'} rada
 * @property {string} author
 * @property {string} created_at
 * @property {number} views
 */

/**
 * @typedef {Object} Announcement
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {'community'|'events'|'work'|'help'|'lostfound'|'other'} category
 * @property {'rada1'|'rada2'} rada
 * @property {boolean} is_urgent
 * @property {string} contact_info
 * @property {string} [image]
 * @property {string} created_at
 * @property {string} expires_at
 */

/**
 * @typedef {Object} Deputy
 * @property {string} id
 * @property {string} name
 * @property {string} position
 * @property {string} [photo]
 * @property {string} phone
 * @property {string} email
 * @property {string} biography
 * @property {'rada1'|'rada2'} rada
 */

/**
 * @typedef {Object} RadaInfo
 * @property {string} id
 * @property {string} name
 * @property {string} short_name
 * @property {string} description
 * @property {string} address
 * @property {string} phone
 * @property {string} email
 * @property {string} working_hours
 * @property {string} reception_hours
 * @property {string} head_name
 * @property {string} head_position
 * @property {string} [head_photo]
 * @property {string} [hero_image]
 * @property {number} population
 * @property {string} area
 * @property {number} founded_year
 */

/**
 * @typedef {Object} ForumTopic
 * @property {string} id
 * @property {string} title
 * @property {string} category
 * @property {string} author
 * @property {number} replies
 * @property {number} views
 * @property {string} [last_reply]
 * @property {boolean} is_pinned
 */

/**
 * @typedef {Object} Product
 * @property {string} id
 * @property {string} name
 * @property {string} description
 * @property {number} price
 * @property {string} [image]
 * @property {string} seller
 * @property {number} rating
 * @property {number} reviews
 * @property {string} category
 * @property {'rada1'|'rada2'} rada
 */

export {};
