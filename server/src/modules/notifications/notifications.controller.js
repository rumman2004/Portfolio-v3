const getGreetingMessage = () => {
  const currentHour = new Date().getHours();
  let greeting;
  if (currentHour < 12) {
    greeting = { text: "Good morning!", icon: "Sun" };
  } else if (currentHour < 17) {
    greeting = { text: "Good afternoon!", icon: "Coffee" };
  } else {
    greeting = { text: "Good evening!", icon: "Moon" };
  }
  
  const eyeCatchingMessages = [
    { text: "Welcome to my portfolio! Glad you're here.", icon: "Hand" },
    { text: "Full-Stack Developer turning ideas into real-world applications.", icon: "Code2" },
    { text: "Always building, always learning, always improving.", icon: "Rocket" },
    { text: "Have a project or idea? Let's build it together!", icon: "Users" },
    { text: "Coffee, code, and creativity — my favorite combination.", icon: "Coffee" },
    { text: "Football fan through and through. Who's winning the next World Cup?", icon: "Trophy" },
    { text: "Neymar Jr. fan since day one. Joga Bonito!", icon: "Star" },
    { text: "When I'm not coding, you'll probably find me watching anime or football.", icon: "Gamepad2" },
    { text: "Anime lover! Always open to recommendations.", icon: "Tv" },
    { text: "Currently exploring AI, Machine Learning, and modern web technologies.", icon: "Bot" },
    { text: "Learning something new every single day.", icon: "BookOpen" },
    { text: "Small details create great user experiences.", icon: "Sparkles" },
    { text: "I enjoy building clean, responsive, and user-friendly websites.", icon: "Smartphone" },
    { text: "Every great project starts with a simple idea.", icon: "Lightbulb" },
    { text: "Consistency beats perfection.", icon: "Target" },
    { text: "Let's solve real-world problems with technology.", icon: "Wrench" },
    { text: "Looking for a developer? I'd love to hear from you.", icon: "Mail" },
    { text: "Need help with a website, app, or idea? Let's connect!", icon: "MessageSquare" },
    { text: "Building solutions that make a difference.", icon: "Globe" },
    { text: "Turning coffee into code since day one.", icon: "Zap" },
    { text: "Passionate about coding, football, anime, and continuous learning.", icon: "Heart" },
    { text: "Thanks for visiting! Feel free to explore my projects.", icon: "PartyPopper" },
    { text: "Something exciting is always under development.", icon: "Construction" },
    { text: "Dream big. Build bigger.", icon: "Rocket" },
    { text: "Scroll down and let's create something amazing together!", icon: "ArrowDownCircle" }
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
