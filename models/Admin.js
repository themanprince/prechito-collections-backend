const bcryptjs = require("bcryptjs");
const connectDB = require(__dirname + "/../helpers/connectDB");

class Admin {
	
	/*admin_id field dey too*/
	#email;
	#username;
	#password;
	#salt;
	
	constructor(payload) {
		
		this.admin_id = null;
		this.#salt = null;
		const {email, username, password} = payload;
		this.#email = email;
		this.#username = username;
		this.#password = password;
		
	}
	
	toJSON() {
		return {
			"email": this.#email,
			"username": this.#username,
			"admin_id": this.admin_id
		};
	}
	
	static async findOne(propToUse /*I expect username or email*/) {
		const propKeys = Object.keys(propToUse).map(key => key.toLowerCase());
		
		if(propKeys.some(key => (["username", "email"].indexOf(key)) == -1))
			throw new Error(`some element of propToUse not valid for finding elements with`);
			
		const conn = await connectDB();
		const theQuery = `SELECT admin_id, email, username, password FROM pc_admin.admin WHERE ${propKeys.map(key => `${key}='${propToUse[key]}'`).join(" AND ")}`;
		
		const rows = (await conn.query(theQuery)).rows;
		
		const user = rows[0];
		
		return user || null;
	}
	
	async save() {
		
		const userWithThisEmail = await Admin.findOne({"email": this.#email});
		
		const userWithThisUsername = await Admin.findOne({"username": this.#username});
		
		
		const throwError = (fld) => {throw new Error("Users already exist with this " + fld)};
		
		if(userWithThisUsername)
			throwError("username");
			
		if(userWithThisEmail)
			throwError("email");
			
		this.#salt = await bcryptjs.genSalt(3, 10);
		this.#password = await bcryptjs.hash(this.#password, this.#salt);
		
		
		const query = `
			INSERT INTO pc_admin.admin(email, username, password, salt)
			VALUES ($1, $2, $3, $4)
			RETURNING admin_id;
		`;
		const conn = await connectDB();
		const result /*contains id*/ = await conn.query(query, [this.#email, this.#username, this.#password, this.#salt]);
		this.admin_id = result.rows[0]["admin_id"];
	}
	
	static async authenticate(payload /*username/email and password to check*/) {
		const {email, username, password} = payload;
		
		const check_if_user_with_kini_exists = async (kini) => {
			const userWithKini = await Admin.findOne(kini);
			if( ! userWithKini)
				throw new Error(`no user exists with ${kini}`);
			else
				return userWithKini;
		}
		
		let theUser;
		
		if(email) {
			theUser = await check_if_user_with_kini_exists({email})
		} else if(username) {
			theUser = await check_if_user_with_kini_exists({username});
		} else {
			throw new Error("pass in username/email to use to find user");
		}
		
		const isValidPassword = await bcryptjs.compare(password, theUser.password);
		return isValidPassword;
	}
	
	static async getAllEmailsAndNames() {
		const conn = await connectDB();
		const query = `SELECT email, username FROM pc_admin.admin`;
		const result = await conn.query(query);
		return result.rows;
	}
}

module.exports = Admin;