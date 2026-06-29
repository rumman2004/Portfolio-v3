const getGreetingMessage = () => {
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = "Good morning! ☀️";
  } else if (currentHour < 18) {
    greeting = "Good afternoon! 🚀";
  } else {
    greeting = "Good evening! 🌙";
  }
  
  const eyeCatchingMessages = [
  "👋 Welcome to my portfolio! Glad you're here.",
  "💻 Full-Stack Developer turning ideas into real-world applications.",
  "🚀 Always building, always learning, always improving.",
  "🤝 Have a project or idea? Let's build it together!",
  "☕ Coffee, code, and creativity — my favorite combination.",
  "⚽ Football fan through and through. Who's winning the next World Cup? 😉",
  "🇧🇷 Neymar Jr. fan since day one. Joga Bonito! 💛💚",
  "🎮 When I'm not coding, you'll probably find me watching anime or football.",
  "🎌 Anime lover! Always open to recommendations.",
  "🤖 Currently exploring AI, Machine Learning, and modern web technologies.",
  "🌱 Learning something new every single day.",
  "✨ Small details create great user experiences.",
  "📱 I enjoy building clean, responsive, and user-friendly websites.",
  "💡 Every great project starts with a simple idea.",
  "🔥 Consistency beats perfection.",
  "🎯 Let's solve real-world problems with technology.",
  "📬 Looking for a developer? I'd love to hear from you.",
  "💬 Need help with a website, app, or idea? Let's connect!",
  "🌍 Building solutions that make a difference.",
  "⚡ Turning coffee into code since day one.",
  "❤️ Passionate about coding, football, anime, and continuous learning.",
  "🎉 Thanks for visiting! Feel free to explore my projects.",
  "🚧 Something exciting is always under development.",
  "⭐ Dream big. Build bigger.",
  "👀 Scroll down and let's create something amazing together!"
];
  
  const randomMessage = eyeCatchingMessages[Math.floor(Math.random() * eyeCatchingMessages.length)];
  
  return { greeting, randomMessage };
};

export const getRandomNotification = (req, res) => {
  const { greeting, randomMessage } = getGreetingMessage();
  res.status(200).json({
    success: true,
    greeting: greeting,
    message: randomMessage
  });
};
