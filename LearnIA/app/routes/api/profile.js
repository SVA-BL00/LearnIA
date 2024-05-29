// app/routes/api/profile.js
export default async function handler(req, res) {
	const userProfile = req.session.userProfile || null;
	res.json(userProfile);
}
