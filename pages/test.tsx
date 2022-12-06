export default function TestPage() {
	return <div>
		<h1>Test Page</h1>
		<form action="http://localhost:3000/api/entry/88dc08aa-25e7-4657-af68-3dc0a69d6c95">
			<label htmlFor="firstName">First name:</label><br />
			<input type="text" id="firstName" name="firstName" placeholder="John" /><br />
			<label htmlFor="lastName">Last name:</label><br />
			<input type="text" id="lastName" name="lastName" placeholder="Smith" /><br />
			<label htmlFor="email">Email:</label><br />
			<input type="text" id="email" name="email" placeholder="Email" /><br />
			<label htmlFor="phone">Phone:</label><br />
			<input type="text" id="phone" name="phone" placeholder="Phone" /><br />
			<label htmlFor="message">Message:</label><br />
			<input type="text" id="message" name="message" placeholder="Hello, world!" /><br />
			<label htmlFor="car">Choose a car:</label>
			<select id="car" name="car">
				<option value="volvo">Volvo</option>
				<option value="saab">Saab</option>
				<option value="fiat">Fiat</option>
				<option value="audi">Audi</option>
			</select><br />
			{/* <label htmlFor="cars">Choose a few cars:</label>
			<select id="cars" name="cars" size={4} multiple>
				<option value="volvo">Volvo</option>
				<option value="saab">Saab</option>
				<option value="fiat">Fiat</option>
				<option value="audi">Audi</option>
			</select> */}
			<br /><input type="submit" value="Submit" />
		</form>
	</div>
}