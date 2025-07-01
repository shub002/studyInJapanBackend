const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI;
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }).then((conn) => conn);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

// Updated schema with new fields
const ContactSchema = new mongoose.Schema({
  name: String,
  dobYear: String,
  dobMonth: String,
  dobDay: String,
  occupation: String,
  email: String,
  cmail: String,
  tel: String,
  address: String,
  jlpt: String,
  interestedCourse: String,
  questions: String,
  submittedAt: { type: Date, default: Date.now },
});

const Contact = mongoose.models.Contact || mongoose.model('Contact', ContactSchema);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Only POST allowed' });
  }

  const {
    name,
    dobYear,
    dobMonth,
    dobDay,
    occupation,
    email,
    cmail,
    tel,
    address,
    jlpt,
    interestedCourse,
    questions
  } = req.body;

  try {
    await connectToDB();

    const newContact = await Contact.create({
      name,
      dobYear,
      dobMonth,
      dobDay,
      occupation,
      email,
      cmail,
      tel,
      address,
      jlpt,
      interestedCourse,
      questions
    });

    return res.status(200).json({
      success: true,
      message: 'Contact saved successfully',
      data: newContact,
    });
  } catch (err) {
    console.error('MongoDB Save Error:', err);
    return res.status(500).json({ success: false, error: 'Failed to save contact' });
  }
};
