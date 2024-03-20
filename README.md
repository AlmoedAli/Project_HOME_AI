# Setup lần đầu
Vì việc push kèm thư mục node_modules sẽ khiến project trở nên rất nặng, nên khi clone project lần đầu, tiến hành cài đặt các thư viện cần thiết.
Mở terminal và gõ:
```bash
npm install
```
Ngoài ra, đang trong giai đoạn dev nên file .env sẽ không cần phải thêm vào trong .gitignore

# Chạy web
```bash
npm start
```
Lên trình duyệt bất kì và gõ http://localhost:8000/ hoặc ấn vào [đây](http://localhost:8000/) nếu trang web không tự động chạy.
Khi đã thực hiện xong, ấn tổ hợp `Ctrl + C` để ngừng chạy web.

# Các công nghệ được sử dụng
* Front-end:
  * HTML (View engine: Handlebars) + CSS
  * Javascript
  * jQuery
* Back-end:
  * ExpressJS
  * Database: MongoDB


# Cấu trúc các folder của project
<!-- │ ├ ─ └ -->
```bash
.
├── index.js [1]
├── views
│   ├── folder (?)
│   │   └──home.handlebars
│   └── layouts
│          └── main.handlebars
├── routes
│   ├── index.js [2]
│   └── folder (?)
│       └── home.js
└── app  
    ├── controllers 
    │   └── folder (?)
    │       └── HomeController.js
    └── models
        └── home.js (?)
```
[n], n là số: Phân biệt các file/folder trùng tên.
(?): Không bắt buộc phải có.

* File `index.js` cấp cao nhất (`index.js [1]`) là file chứa các thư viện chính, config của project. Không cần chỉnh sửa file này.
* Folder views chứa file front end của project. 
  * ExpressJS không sử dụng định dạng `.html` bình thường mà cần một view engine. View engine được sử dụng trong project là `handlebars`, với đuôi file là `.handlebars` (được rút gọn thành `.hbs` trong file `index.js [1]`). Express-handlebars là coi như một file html, có khả năng nhận các biến truyền vào từ phía controller mà không cần script.
  * Trong folder views chứa folder layouts là thư mục chứa các bố cục chính của project, sẽ được tự động gọi khi controller gọi một view bất kì ngoài layouts. Trong các file layouts chứa biến body, được sử dụng bằng cách gọi `{{{ body }}}`. Khi gọi một view ngoài layouts từ controller, layout tương ứng sẽ được gọi (nếu có, không thì sẽ mặc định dùng main), sau đó là view được gọi sẽ được đặt ở chỗ body. 
  * Code ví dụ trong file trong folder **`Controller`**:
    ```javascript
    index(req, res, next) {
        res.render('user/example', {
            layout: 'main',
            variable: [{"a": true, "b": "show"}, {"a": false, "b": "hide"}]
        })
    }
    ```
    Code ví dụ trong file trong folder **`View`**:
    ```hbs
    {{#each variable}}
        {{#if this.a}}
            {{this.b}}
        {{/if}}
    {{/each}}
    ```
    View được gọi là example.hbs với địa chỉ `./views/user/example.hbs`, layout được sử dụng là main.hbs nằm trong thư mục layouts. Biến truyền từ bên controller vào hbs là biến variable.
* Folder routes chứa file index.js [2]. Đây là file hướng các module đến một đường dẫn trang web nhất định.
```javascript
const exampleRouter = require('./user/example');
function route(app) {
    app.use('/example', exampleRouter);
}
```
Trong ví dụ trên, chúng ta import module với địa chỉ `./routes/user/example.js`. Lưu ý, ở đây ta chưa đặc tả phương thức http, việc này sẽ được thực hiện trong `example.js`.
```javascript
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../../middlewares/session');

const exampleController = require('../../app/controllers/user/ExampleController')

router.get('/', exampleController.index);
router.post('/', exampleController.add);
router.get('/home', isAuthenticated, exampleController.home);
router.get('/home/homework', isAuthenticated, isAdmin, exampleController.homework);
```
Khi được gọi như trên trong file `index.js` thì địa chỉ cơ sở của file `example.js` sẽ thành `./example/`. Trong ví dụ trên, ta có thể truy cập vào địa chỉ web `./example/`, khi đó router sẽ thực hiện phương thức `index` trong `class ExampleController` và gọi view tương ứng. Tương tự khi ta thực hiện phương thức `post` đến địa chỉ web `./example/`, phương thức `add` trong `class ExampleController` sẽ được gọi. Ngoài ra, khi thực hiện phương thức `get` đến địa chỉ web `./example/home/`, hệ thống sẽ kiểm tra thông qua hàm `isAuthenticated`, nếu được cấp phép thì phương thức `home` sẽ được thực hiện, không thì sẽ đẩy về trang 403 hoặc thực hiện theo yêu cầu (sửa trong file `./middlewares/sesion.js`). Có thể để nhiều lớp bảo mật.
* Các file controller chứa các phương thức cần thiết để lấy, xử lý dữ liệu và đưa người dùng đến view cần thiệt. Folder models chứa các định dạng dữ liệu khi lấy từ / đẩy lên cơ sở dữ liệu. Có thể import các module models vào các file controller. 
  * Lưu ý, `res.render()` và `res.redirect()` là 2 phương thức hoàn toàn khác nhau. `res.render()` sẽ trực tiếp gọi view cần thiết, trong khi đó `res.redirect()` chỉ đưa địa chỉ trang web về thông số truyền vào.

Chúc các bạn một ngày tốt lành.
