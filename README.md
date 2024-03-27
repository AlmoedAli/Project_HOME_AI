# Setup lần đầu
Vì việc push kèm thư mục `node_modules` sẽ khiến project trở nên rất nặng, nên khi clone project lần đầu, tiến hành cài đặt các thư viện cần thiết.
Mở terminal và nhập:
```bash
npm install
```
Ngoài ra, đang trong giai đoạn dev nên file .env sẽ không cần phải thêm vào trong .gitignore

# Chạy web
Mở terminal và nhập:
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
  * **Lưu ý**, vì form html chỉ cho phép nhận các method GET và POST, một thư viện được thêm vào là method-override cho phép sử dụng các phương thức khác như PUT, PATCH, DELETE, .... Dưới đây là các ví dụ về việc sử dụng phương thức DELETE. 
    * Ví dụ khi xóa một object với id bất kì, một modal sẽ hiện lên xác nhận ta có muốn xóa, ta có thể thực hiện như sau (sử dụng `requst param`):
      ```hbs
      <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#modal-delete" data-bs-delete="a">A</button>
      <button class="delete-btn" data-bs-toggle="modal" data-bs-target="#modal-delete" data-bs-delete="b">B</button>
      <div class="modal fade" id="modal-delete" tabindex="-1" role="dialog" aria-labelledby="modal-delete__Label" aria-hidden="true">
          <div class="modal-dialog" role="document">
              <div class="modal-content">
                  <button type="button" id="btn-delete-confirm">Xác nhận</button>
              </div>
          </div>
      </div>
      <form id="form-delete" method="post"></form>
      <script type="text/javascript">
          var deleteId;
          var deleteBtn = document.getElementById('btn-delete-confirm');
          var deleteForm = document.forms['form-delete']; 
          var deleteModal = document.getElementById('modal-delete');

          deleteModal.addEventListener('show.bs.modal', function(event) {
              var btn = event.relatedTarget;
              deleteId = btn.getAttribute('data-bs-delete');
          });
          
          deleteBtn.onclick = function() {
              deleteForm.action = '/example/' + deleteId + '?_method=delete';
              deleteForm.submit();
          }
      </script>
      ```
      Khi ấn vào nút A hoặc B, một modal sẽ hiện lên và giá trị id cần xóa sẽ được truyền vào biến `deleteId`.

      Khi ấn nút button xác nhận, chúng ta sẽ truyền id cần xóa vào link của một form ẩn và thực hiện submit form đó cùng với phương thức `delete`.
        ```javascript
        router.delete('/:name_id', exampleController.deleteExample);
        ```
      Để bắt được giá trị biến `deleteId` với phương thức `delete`, ta sẽ thực hiện thêm đoạn như trên vào file `example.js` (hoặc file `routes` cần thiết tương ứng với web có địa chỉ cơ sở là `'/example/'`)
        ```javascript
        deleteExample(res, req, next) {
            var _id = res.param.name_id;
        };
        ```
      Để lấy và sử dụng biến `deleteId` truyền từ `view`, hàm `deleteExample` trong file `ExampleController.js` được thực hiện như trên.

      Trong ví dụ trên, ta giả sử biến id của vật thể được xóa là một giá trị không nhạy cảm nên có thể sử dụng `request param`. Thực tế, cách thực hành tốt là đối với phương thức GET ta sẽ sử dụng `request param`, còn các phương thức khác như POST, PUT, PATCH, DELETE, ta sẽ sử dụng `request body`. Cách làm chung là trong thẻ `form` của html (hbs) sẽ có các thẻ có 2 thuộc tính là `name` và `value` và một thẻ `<button type="submit"></button>`. Khi thẻ này được ấn thì các cặp name: value tương ứng sẽ được đẩy vào `request body` dưới dạng object, và có thể lấy bằng cách `req.body`. Để thay đổi phần code trên theo định dạng sử dụng `request body` thì ta sẽ cần một thẻ `<input type='hidden'>` trong `form` ẩn và không cần đến biến `deleteId` trong `script`. Trong project này thì không cần thiết về bảo mật nên không cần làm theo cách `request body` đối với phương thức DELETE (vì khá lằng nhằng), còn những phương thức khác (PUT, PATCH, POST) thì có thể sử dụng bình thường.
  * Folder public là root trong view, nên khi thêm style css (hoặc bất cứ thứ gì từ trong folder public), không cần thêm địa chỉ của public.
* Folder routes chứa file index.js [2]. Đây là file hướng các module đến một đường dẫn trang web nhất định.
  ```javascript
  const exampleRouter = require('./user/example');
  function route(app) {
      app.use('/example', exampleRouter);
  }
  ```
  Trong ví dụ trên, chúng ta import module với địa chỉ `./routes/user/example.js`. **Lưu ý**, ở đây ta chưa đặc tả phương thức http, việc này sẽ được thực hiện trong `example.js`.
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
  * **Lưu ý**, `res.render()` và `res.redirect()` là 2 phương thức hoàn toàn khác nhau. `res.render()` sẽ trực tiếp gọi view cần thiết, trong khi đó `res.redirect()` chỉ đưa địa chỉ trang web về thông số truyền vào.

Chúc các bạn một ngày tốt lành.
