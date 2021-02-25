var { buildSchema } = require('graphql');

var coursesData = [
    {
        id: 1,
        title: 'The Complete Node.js Developer Course',
        author: 'Andrew Mead, Rob Percival',
        description: 'Learn Node.js by building real-world applications with Node, Express, MongoDB, Mocha, and more!',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs/'
    },
    {
        id: 2,
        title: 'Node.js, Express & MongoDB Dev to Deployment',
        author: 'Brad Traversy',
        description: 'Learn by example building & deploying real-world Node.js applications from absolute scratch',
        topic: 'Node.js',
        url: 'https://codingthesmartway.com/courses/nodejs-express-mongodb/'
    },
    {
        id: 3,
        title: 'JavaScript: Understanding The Weird Parts',
        author: 'Anthony Alicea',
        description: 'An advanced JavaScript course for everyone! Scope, closures, prototypes, this, build your own framework, and more.',
        topic: 'JavaScript',
        url: 'https://codingthesmartway.com/courses/understand-javascript/'
    }
]

module.exports = {
    courseSchema:buildSchema(`
        type Query{
            course(id:Int!):Course
            courses(topic:String):[Course]
        }
        type Mutation {
            updateCourseTopic(id: Int!, topic: String!): Course
            createCourse(title:String!,topic:String!,author:String!,description:String!,url:String!): Course
            deleteCourseById(id: Int!): String
        }
        type Course{
            id: Int
            title: String
            author: String
            description: String
            topic: String
            url: String
        }
    `),
    courseRoute:{
        course : function(args) { 
            var id = args.id;
            return coursesData.filter(course => {
                return course.id == id;
            })[0];
        },
        courses : function(args) {
            if (args.topic) {
                var topic = args.topic;
                return coursesData.filter(course => course.topic === topic);
            } else {
                return coursesData;
            }
        },
        updateCourseTopic : function({id, topic}) {
            debugger
            coursesData.map(course => {
                if (course.id === id) {
                    course.topic = topic;
                    return course;
                }
            });
            return coursesData.filter(course => course.id === id) [0];
        },
        createCourse : function(args){
            course = {
                id: coursesData.length + 1,
                title: args.title,
                author: args.author,
                description: args.description,
                topic: args.topic,
                url: args.url
            }
            coursesData.push(course)
            return course
        },
        deleteCourseById : function({id}){
            courseIdArr = coursesData.map((c,index) => {
                if (c.id === id) {
                    return index;
                }
            });
            delCourseId = courseIdArr.filter((index) => {
                if(index >= 0){
                    return 'found'
                }
            })
            if(delCourseId && delCourseId.length){
                data = coursesData.splice(delCourseId[0],1)
                return "Course Deleted"
            }
            else{
                return "Course Not found"
            }
        }
    }
}