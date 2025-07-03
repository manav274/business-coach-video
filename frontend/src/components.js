import React, { useState, useEffect, createContext, useContext } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";

// Context for managing course data and progress
const CourseContext = createContext();

// Mock data for courses
const coursesData = [
  {
    id: 1,
    title: "Complete Business Leadership Mastery",
    instructor: "Sarah Johnson",
    rating: 4.8,
    students: 12843,
    duration: "8 hours",
    price: "$89.99",
    image: "https://images.pexels.com/photos/7616608/pexels-photo-7616608.jpeg",
    description: "Master the art of leadership and transform your business with proven strategies used by top executives worldwide.",
    category: "Business Leadership",
    lastUpdated: "December 2024",
    videos: [
      {
        id: 1,
        title: "Introduction to Modern Leadership",
        duration: "12:30",
        videoId: "qp0HIF3SfI4", // TED Talk about Leadership
        description: "Understanding the fundamentals of leadership in today's business world"
      },
      {
        id: 2,
        title: "Building High-Performance Teams",
        duration: "18:45",
        videoId: "fxbCHn6gE3U", // Simon Sinek on Leadership
        description: "Learn how to create and manage teams that deliver exceptional results"
      },
      {
        id: 3,
        title: "Strategic Decision Making",
        duration: "15:20",
        videoId: "ReRcHdeUG9Y", // Strategic thinking video
        description: "Master the art of making crucial business decisions under pressure"
      },
      {
        id: 4,
        title: "Leading Through Change",
        duration: "22:15",
        videoId: "iG9CE55wbtY", // Change management video
        description: "Navigate organizational change and lead your team through transitions"
      }
    ]
  },
  {
    id: 2,
    title: "Entrepreneurship Excellence: From Idea to Success",
    instructor: "Michael Rodriguez",
    rating: 4.9,
    students: 8967,
    duration: "10 hours",
    price: "$79.99",
    image: "https://images.pexels.com/photos/8532850/pexels-photo-8532850.jpeg",
    description: "Transform your business ideas into successful ventures with this comprehensive entrepreneurship course.",
    category: "Entrepreneurship",
    lastUpdated: "January 2025",
    videos: [
      {
        id: 1,
        title: "The Entrepreneurial Mindset",
        duration: "16:30",
        videoId: "bEusrD8g-dM", // Entrepreneurship mindset
        description: "Develop the mindset and characteristics of successful entrepreneurs"
      },
      {
        id: 2,
        title: "Validating Your Business Idea",
        duration: "19:45",
        videoId: "xPJoq_QVsY4", // Business validation
        description: "Learn proven methods to validate your business concept before investing"
      },
      {
        id: 3,
        title: "Building a Sustainable Business Model",
        duration: "24:20",
        videoId: "IP0cUBWTgpY", // Business model canvas
        description: "Create a robust business model that ensures long-term success"
      },
      {
        id: 4,
        title: "Scaling Your Startup",
        duration: "20:15",
        videoId: "ZoqgAy3h4OM", // Scaling businesses
        description: "Strategies for growing and scaling your startup effectively"
      }
    ]
  }
];

// Course Provider Component
export const CourseProvider = ({ children }) => {
  const [courses] = useState(coursesData);
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('courseProgress');
    return savedProgress ? JSON.parse(savedProgress) : {};
  });

  const updateProgress = (courseId, videoId) => {
    const newProgress = {
      ...progress,
      [courseId]: {
        ...progress[courseId],
        [videoId]: true
      }
    };
    setProgress(newProgress);
    localStorage.setItem('courseProgress', JSON.stringify(newProgress));
  };

  const getCourseProgress = (courseId) => {
    const courseProgress = progress[courseId] || {};
    const course = courses.find(c => c.id === courseId);
    if (!course) return 0;
    
    const completedVideos = Object.values(courseProgress).filter(Boolean).length;
    return Math.round((completedVideos / course.videos.length) * 100);
  };

  const getVideoProgress = (courseId, videoId) => {
    return progress[courseId] && progress[courseId][videoId];
  };

  return (
    <CourseContext.Provider value={{
      courses,
      progress,
      updateProgress,
      getCourseProgress,
      getVideoProgress
    }}>
      {children}
    </CourseContext.Provider>
  );
};

// Header Component
export const Header = () => {
  const navigate = useNavigate();
  
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center">
              <div className="text-2xl font-bold text-purple-600">
                <span className="text-purple-800">Biz</span>
                <span className="text-purple-600">Coach</span>
              </div>
            </Link>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <Link to="/" className="text-gray-700 hover:text-purple-600 px-3 py-2 text-sm font-medium">
              My Courses
            </Link>
            <span className="text-gray-700 px-3 py-2 text-sm font-medium">
              Browse
            </span>
            <span className="text-gray-700 px-3 py-2 text-sm font-medium">
              Teach
            </span>
          </nav>

          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search for courses..."
                className="w-64 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
              <svg className="absolute right-3 top-2.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Sign In
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Course Card Component
const CourseCard = ({ course }) => {
  const { getCourseProgress } = useContext(CourseContext);
  const progressPercentage = getCourseProgress(course.id);
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 bg-yellow-400 text-yellow-900 px-2 py-1 rounded text-xs font-semibold">
          Bestseller
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {course.title}
        </h3>
        <p className="text-gray-600 text-sm mb-2">{course.instructor}</p>
        
        <div className="flex items-center mb-2">
          <span className="text-yellow-500 text-sm font-semibold">{course.rating}</span>
          <div className="flex ml-1">
            {[...Array(5)].map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
          <span className="text-gray-500 text-sm ml-2">({course.students.toLocaleString()})</span>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between items-center mb-1">
            <span className="text-sm text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-purple-600">{progressPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold text-gray-900">{course.price}</span>
          <Link
            to={`/course/${course.id}`}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
          >
            Continue Learning
          </Link>
        </div>
      </div>
    </div>
  );
};

// Dashboard Component
export const Dashboard = () => {
  const { courses } = useContext(CourseContext);
  
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 mb-8 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold mb-2">Welcome back to your learning journey!</h1>
            <p className="text-purple-100 text-lg">Continue mastering business coaching skills</p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1448387473223-5c37445527e7?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2NDF8MHwxfHNlYXJjaHwxfHxzdWNjZXNzfGVufDB8fHxibHVlfDE3NTE1NDQ2NDR8MA&ixlib=rb-4.1.0&q=85"
            alt="Success"
            className="w-24 h-24 rounded-full object-cover"
          />
        </div>
      </div>

      {/* Course Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 rounded-full p-3">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Enrolled Courses</p>
              <p className="text-2xl font-bold text-gray-900">{courses.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Completed Videos</p>
              <p className="text-2xl font-bold text-gray-900">
                {Object.values(JSON.parse(localStorage.getItem('courseProgress') || '{}')).reduce((total, course) => {
                  return total + Object.values(course).filter(Boolean).length;
                }, 0)}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">Learning Hours</p>
              <p className="text-2xl font-bold text-gray-900">18</p>
            </div>
          </div>
        </div>
      </div>

      {/* My Courses Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">My Courses</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Recommendations Section */}
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recommended for You</h3>
        <div className="flex items-center space-x-4">
          <img
            src="https://images.unsplash.com/photo-1560250163-17506787d971?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDk1Nzl8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMG1lZXRpbmd8ZW58MHx8fGJsdWV8MTc1MTU0NDYzOHww&ixlib=rb-4.1.0&q=85"
            alt="Recommended Course"
            className="w-16 h-16 rounded-lg object-cover"
          />
          <div>
            <h4 className="font-semibold text-gray-900">Advanced Negotiation Strategies</h4>
            <p className="text-gray-600 text-sm">Master the art of business negotiations</p>
            <span className="text-purple-600 font-semibold">$59.99</span>
          </div>
        </div>
      </div>
    </div>
  );
};

// YouTube Player Component
const YouTubePlayer = ({ videoId, onVideoEnd }) => {
  const [player, setPlayer] = useState(null);
  
  useEffect(() => {
    // Load YouTube IFrame API
    if (!window.YT) {
      const script = document.createElement('script');
      script.src = 'https://www.youtube.com/iframe_api';
      script.async = true;
      document.body.appendChild(script);
      
      window.onYouTubeIframeAPIReady = () => {
        initializePlayer();
      };
    } else {
      initializePlayer();
    }
  }, [videoId]);

  const initializePlayer = () => {
    const newPlayer = new window.YT.Player('youtube-player', {
      height: '400',
      width: '100%',
      videoId: videoId,
      playerVars: {
        rel: 0,
        modestbranding: 1,
        showinfo: 0
      },
      events: {
        onStateChange: (event) => {
          if (event.data === window.YT.PlayerState.ENDED) {
            onVideoEnd();
          }
        }
      }
    });
    setPlayer(newPlayer);
  };

  return (
    <div className="w-full">
      <div id="youtube-player"></div>
    </div>
  );
};

// Video Player Component
const VideoPlayer = ({ video, onVideoEnd }) => {
  return (
    <div className="bg-black rounded-lg overflow-hidden">
      <YouTubePlayer videoId={video.videoId} onVideoEnd={onVideoEnd} />
    </div>
  );
};

// Course Details Component
export const CourseDetails = () => {
  const { courseId } = useParams();
  const { courses, updateProgress, getCourseProgress, getVideoProgress } = useContext(CourseContext);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  
  const course = courses.find(c => c.id === parseInt(courseId));
  
  if (!course) {
    return <div className="text-center py-12">Course not found</div>;
  }

  const currentVideo = course.videos[currentVideoIndex];
  const progressPercentage = getCourseProgress(course.id);

  const handleVideoEnd = () => {
    updateProgress(course.id, currentVideo.id);
  };

  const handleVideoSelect = (index) => {
    setCurrentVideoIndex(index);
  };

  const handleNextVideo = () => {
    if (currentVideoIndex < course.videos.length - 1) {
      setCurrentVideoIndex(currentVideoIndex + 1);
    }
  };

  const handlePrevVideo = () => {
    if (currentVideoIndex > 0) {
      setCurrentVideoIndex(currentVideoIndex - 1);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          {/* Course Header */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            
            <div className="flex items-center space-x-4 mb-4">
              <div className="flex items-center">
                <span className="text-yellow-500 font-semibold mr-1">{course.rating}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
              </div>
              <span className="text-gray-500">({course.students.toLocaleString()} students)</span>
              <span className="text-gray-500">Created by {course.instructor}</span>
            </div>

            {/* Progress Bar */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-700">Course Progress</span>
                <span className="text-sm font-bold text-purple-600">{progressPercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-purple-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Video Player */}
          <div className="mb-6">
            <div className="bg-gray-900 rounded-lg p-4">
              <h2 className="text-xl font-semibold text-white mb-4">
                {currentVideo.title}
              </h2>
              <VideoPlayer video={currentVideo} onVideoEnd={handleVideoEnd} />
              
              {/* Video Controls */}
              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePrevVideo}
                  disabled={currentVideoIndex === 0}
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Previous
                </button>
                
                <button
                  onClick={() => handleVideoEnd()}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Mark as Complete
                </button>
                
                <button
                  onClick={handleNextVideo}
                  disabled={currentVideoIndex === course.videos.length - 1}
                  className="flex items-center px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                  <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>

          {/* Video Description */}
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">About this video</h3>
            <p className="text-gray-600">{currentVideo.description}</p>
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Content</h3>
            <div className="space-y-3">
              {course.videos.map((video, index) => (
                <div
                  key={video.id}
                  className={`p-3 rounded-lg cursor-pointer transition-colors ${
                    index === currentVideoIndex 
                      ? 'bg-purple-50 border-2 border-purple-200' 
                      : 'bg-gray-50 hover:bg-gray-100'
                  }`}
                  onClick={() => handleVideoSelect(index)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${
                        getVideoProgress(course.id, video.id) 
                          ? 'bg-green-500 text-white' 
                          : 'bg-gray-300 text-gray-600'
                      }`}>
                        {getVideoProgress(course.id, video.id) ? (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1.01M15 10h1.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm">{video.title}</p>
                        <p className="text-gray-500 text-xs">{video.duration}</p>
                      </div>
                    </div>
                    {index === currentVideoIndex && (
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Course Info */}
          <div className="bg-white rounded-lg p-6 shadow-sm mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Course Details</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Duration</span>
                <span className="font-medium">{course.duration}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Level</span>
                <span className="font-medium">Intermediate</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Language</span>
                <span className="font-medium">English</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Category</span>
                <span className="font-medium">{course.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Updated</span>
                <span className="font-medium">{course.lastUpdated}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};