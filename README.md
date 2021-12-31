# Trình Thu Thập Dữ Liệu Sinh Viên Trường Cao Đẳng Công Nghệ Thủ Đức

Đây là trình thu thập dữ liệu sinh viên trường Cao Đẳng Công Nghệ Thủ Đức được thu thập từ trang http://online.tdc.edu.vn/.

## Yêu Cầu

1. Cài đặt môi trường NodeJS phiên bản `v14.17.3` hoặc cao hơn. Nếu chưa cài đặt bạn có thể cài nó [ở đây](https://nodejs.org/en/).

2. Mình khuyên bạn nên sử dụng `yarn` cho dự án này để tránh xung đột. Để tiếp tục cài `yarn` hãy sử dụng câu lệnh sau:

```
$ npm install -g yarn
```


## Cài Đặt Và Sử Dụng

Clone hoặc tải dự án về.

Mở Terminal / Command Line và thực hiện những bước sau đây.

1. Di chuyển vào thư mục dự án và cài đặt:

```
$ cd data-tdc
$ yarn install
```

2. Chạy câu lệnh dưới đây để bắt đầu:

```
$ yarn start
```


## Cơ Chế Hoạt Động

Dữ liệu khi cào sẽ được lọc qua 6000 mã số sinh viên, để chương trình được tối ưu, nếu quá 10 lần không thể truy cập được sẽ dừng chương trình lại.

Chương trình sẽ chạy qua tất cả các mã ngành hiện tại kèm mã số sinh viên mà tôi đã liệt kê ra:

Độ khó thuật toán O(n^2).

```
  "CD",
  "CK",
  "CT",
  "DC",
  "DD",
  "DH",
  "DK",
  "DT",
  "KD",
  "KS",
  "KT",
  "LG",
  "LH",
  "NH",
  "OT",
  "QT",
  "TA",
  "TC",
  "TH",
  "TM",
  "TN",
  "TT",
```


## License

[MIT](https://github.com/tronghieu60s/data-tdc/blob/master/LICENSE)


## Đóng Góp

Để đóng góp vào dự án bạn vui lòng tạo một [PR](https://github.com/tronghieu60s/data-tdc/pulls).

Đối với các bug và yêu cầu tính năng, vui lòng tạo một [Issue](https://github.com/tronghieu60s/data-tdc/issues).
