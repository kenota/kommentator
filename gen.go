package kommentator

//go:generate npm --prefix frontend/ run build
//go:generate go-bindata -pkg frontend -prefix frontend -o frontend/bindata.go frontend/dist
//go:generate go-bindata -pkg migrations -prefix migrations -o migrations/bindata.go migrations/
