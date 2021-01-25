
let items = [];
let tempArr = [];
let counter = 0;

$(document).ready(function (event) {

    loadJson('./lists/items.txt');

    window.onscroll = function () {
        scrollBtn();
    }

    $('#searchProduct').on('input', function () {

        tempArr = [];

        searchVal = $('#searchProduct').val();
        lastChar = searchVal.substr(searchVal.length - 1);

        let products = items[0];

        $('.productWrapper').remove();

        for (let i = 0; i < products.length; i++) {
            let productName = $(products)[i].name;
            let productDesc = $(products)[i].description;

            if (productName.includes(searchVal.toLowerCase()) || productDesc.includes(searchVal.toLowerCase())) {
                tempArr.push($(products)[i]);
                
                setTimeout(function(){
                    $('#productListContent, #prevNextWrapper').remove();
                    counter = 0;
                    buildItems(tempArr);
                }, 0)
            }
        }
    })

    $('#selectFilter').on('change', function () {
        switch($(this).val()) {
            case 'name':
                $($('#selectFilter option')[0]).attr('disabled', true);
                items[0].sort(function(a,b){
                    return a.name.localeCompare(b.name);
                })
                $('#productListContent, #prevNextWrapper').remove();
                counter = 0;
                buildItems(items[0]);
                break;
            case 'price':
                $($('#selectFilter option')[0]).attr('disabled', true);
                items[0].sort(function(a, b) {
                    return a.price - b.price;
                });
                $('#productListContent, #prevNextWrapper').remove();
                counter = 0;
                buildItems(items[0]); 
                break;
                default:
                    break;
        }
    })
});

function loadJson(textFile) {
    $.get(textFile, function (data) {
        items.push(JSON.parse(data));

        setTimeout(function () {
            buildItems(items[0]);
        }, 500);
    });
}

function buildItems(products) {

    let productListContent = $('<div>', {
        id: 'productListContent',
    }).appendTo($('#productList'))

    if (products.length >= 4) {
        build(0, 4, products);
    } else {
        build(0, products.length, products);
    }

    let length = products.length;
    let currentPage = 1;
    let totalProducts = length;
    let pages = Math.ceil(length / 4);

    if (totalProducts > 4) {
        let prevNextWrapper = $('<div>', {
            id: 'prevNextWrapper'
        }).appendTo($('#productList'))
    
        let prevPageBtn = $('<button>', {
            id: 'prevPageBtn',
            text: 'Prev',
            click: function() {
                if (currentPage > 1) {
                    currentPage--;
    
                    if (currentPage == 1) {
                        $(this).css({'opacity': '.2', 'pointer-events': 'none'});
                    } else {
                        $(this).css({'opacity': '1', 'pointer-events': 'all'});
                    }
    
                    if (currentPage < pages) {
                        $('#nextPageBtn').css({'opacity': '1', 'pointer-events': 'all'});
                    }
                    $('#pageNum').html('Page ' + currentPage + ' of ' + pages);
    
                    let lastChild = $('.productWrapper:last-child').attr('itemnum');
    
                    let startNum;
    
                    if (lastChild % 4 == 0) {
                        startNum = Number(lastChild - 8);
                    } else {
                        if (currentPage == 1) {
                            startNum = 0;      
                        } else {
                            startNum = Math.floor(Number(4 + currentPage)) + 1; 
                        }
                    }             
    
                    if (Number(counter - 4) > totalProducts) {
                        counter = startNum;
                        build(startNum - 1, Number(startNum - 4), products);
                    } else {
                        counter = startNum;
                        build(startNum, Number(startNum + 4), products);
                    }     
                }  
            }
        }).appendTo(prevNextWrapper)
    
        let pageNum = $('<span>', {
            id: 'pageNum',
            text: 'Page ' + currentPage + ' of ' + pages,
        }).appendTo(prevNextWrapper)
    
        let nextPageBtn = $('<button>', {
            id: 'nextPageBtn',
            text: 'Next',
            click: function() {
    
                if (currentPage == pages - 1) {
                    $(this).css({'opacity': '.2', 'pointer-events': 'none'});
                } else {
                    $(this).css({'opacity': '1', 'pointer-events': 'all'});
                }
    
                if (currentPage < pages) {
                    currentPage++;
                    if (currentPage > 1) {
                        $('#prevPageBtn').css({'opacity': '1', 'pointer-events': 'all'});
                    }
                    $('#pageNum').html('Page ' + currentPage + ' of ' + pages);
    
                    if (totalProducts > counter + 4 ) {
                        build(counter, Number(counter + 4), products);
                    } else {
                        build(counter, totalProducts, products);
                    }       
                }
            }
        }).appendTo(prevNextWrapper)
    }
}

function build(startNumber, endNum, products) {

    $('.productWrapper').remove();

    for (let i = startNumber; i < endNum; i++) {
        counter++;
        let productWrapper = $('<div>', {
            class: 'productWrapper',
            itemNum: counter,
            productId: products[i].id,
            productName: products[i].name,
            productImg: products[i].urlImage,
            productDesc: products[i].description,
            productPrice: products[i].price,
            click: function() {
                showProductDetails($(this).attr('productId'), $(this).attr('productName'), $(this).attr('productImg'), $(this).attr('productDesc'), $(this).attr('productPrice'));               
            }
        }).appendTo($('#productListContent'))

        let finalNameVal;
        let finalDescVal;

        if (products[i].name.length > 20) {
            finalNameVal = products[i].name.slice(0, 20) + '...';
        } else {
            finalNameVal = products[i].name;
        }

        if (products[i].description.length > 20) {
            finalDescVal = products[i].description.slice(0, 20) + '...';
        } else {
            finalDescVal = products[i].description;
        }

        let productImg = $('<img>', {
            class: 'productImg',
            src: products[i].thumbnailImage
        }).appendTo(productWrapper)

        let productName = $('<p>', {
            class: 'productName',
            text: finalNameVal
        }).appendTo(productWrapper)

        let productDescription = $('<p>', {
            class: 'productDescription',
            text: finalDescVal
        }).appendTo(productWrapper)

        let deleteProductBtn = $('<button>', {
            class: 'deleteProductBtn',
            text: 'Delete',
            click: function(e) {
                e.stopPropagation();
                $('#deleteProductPop').show();
                $('#deleteProductPop').attr('productId', $(this).parent().attr('productId'));
                $('#ProductNameToDelete').html($(this).parent().attr('productName'));
            }
        }).appendTo(productWrapper)
    }
}

function addProduct() {
    showProductDetails(items[0].slice(-1)[0].id + 1, 'Please add name', '../images/addImg.jpg', 'Please add description', '0.00');  
}

function deleteProduct() {

    $.each($('.productWrapper'), function (key, value) {
        if ($('#deleteProductPop').attr('productId') == $(value).attr('productId')) {

            let products = items[0];

            for (let i = 0; i < products.length; i++) {
                if (products[i].id == $('#deleteProductPop').attr('productId')) {
                    products.splice(i, 1);
                }   
            }

            $('#productListContent, #prevNextWrapper').remove();
            counter = 0;
            buildItems(items[0]);

            $('#deleteProductPop').hide();
            $('#deleteProductPop').attr('productId', '');
            $('#ProductNameToDelete').html('');
        }        
    });
}

function showProductDetails(id, prodName, img, desc, price) {
    $('#productDetails').show();
    $('#productList').addClass('minimizeList');
    $('#productDetails').attr('selectedProductId', id);

    $.each($('.productWrapper'), function (key, value) {
        if (id == $(value).attr('productId')) {
            $(value).addClass('selectedDiv');
        }  
    });

    let selectedProductName = $('<p>', {
        id: 'selectedProductName',
        text: prodName
    }).appendTo($('#productDetails'))

    let selectedProductImg = $('<img>', {
        id: 'selectedProductImg',
        src: img
    }).appendTo($('#productDetails'))

    let finalImgClass;

    setTimeout(function() {

        if ($('#selectedProductImg').height() > $('#selectedProductImg').width()) {
            finalImgClass = 'longSelectedImg';
        } else {
            finalImgClass = 'wideSelectedImg';
        }

        $('#selectedProductImg').attr('class', finalImgClass);

        if ($(window).width() < 765) {
            document.querySelector('#productDetails').scrollIntoView({ behavior: 'smooth' });
        }
    }, 500)          

    let selectedProductInputWrapper = $('<div>', {
        id: 'selectedProductInputWrapper',
        class: 'focusBorderWrapper'
    }).appendTo($('#productDetails'))

    let selectedProductNameLbl = $('<label>', {
        id: 'selectedProductNameLbl',
        text: 'Name',
        for: 'selectedProductNameInput'
    }).appendTo(selectedProductInputWrapper)

    let selectedProductNameInput = $('<input>', {
        id: 'selectedProductNameInput',
        type: 'text',
        placeholder: prodName
    }).appendTo(selectedProductInputWrapper)

    let borderOnFocusName = $('<span>', {
        class: 'focusBorder',
    }).appendTo(selectedProductInputWrapper)

    let selectedProductDescriptionWrapper = $('<div>', {
        id: 'selectedProductDescriptionWrapper',
        class: 'focusBorderWrapper'
    }).appendTo($('#productDetails'))

    let selectedProductDescriptionLbl = $('<label>', {
        id: 'selectedProductDescriptionWrapper',
        text: 'Description',
        for: 'selectedProductDescriptionInput'
    }).appendTo(selectedProductDescriptionWrapper)

    let selectedProductDescriptionInput = $('<textarea>', {
        id: 'selectedProductDescriptionInput',
        type: 'text',
        placeholder: desc,
        maxlength: 40,
    }).appendTo(selectedProductDescriptionWrapper)

    let borderOnFocusDesc = $('<span>', {
        class: 'focusBorder',
    }).appendTo(selectedProductDescriptionWrapper)

    let selectedProductPriceWrapper = $('<div>', {
        id: 'selectedProductPriceWrapper',
        class: 'focusBorderWrapper'
    }).appendTo($('#productDetails'))

    let selectedProductPriceLbl = $('<label>', {
        id: 'selectedProductPriceLbl',
        text: 'Price',
        for: 'selectedProductPriceInput'
    }).appendTo(selectedProductPriceWrapper)

    let selectedProductPriceInput = $('<input>', {
        id: 'selectedProductPriceInput',
        type: 'number',
        placeholder: price
    }).appendTo(selectedProductPriceWrapper)

    let borderOnFocusPrice = $('<span>', {
        class: 'focusBorder',
    }).appendTo(selectedProductPriceWrapper)

    let saveProductBtnWrapper = $('<div>', {
        id: 'saveProductBtnWrapper',
    }).appendTo($('#productDetails'))

    let saveProductBtn = $('<button>', {
        id: 'saveProductBtn',
        text: 'Save',
        click: function() {
            checkProductChange();
        }
    }).appendTo(saveProductBtnWrapper)
}

function checkProductChange() {
    let valid = true;

    let nameVal = $('#selectedProductNameInput').val();
    let decsVal = $('#selectedProductDescriptionInput').val();
    let priceVal = $('#selectedProductPriceInput').val();

    if (nameVal == '' || nameVal == undefined || nameVal == 0) {
        $('#selectedProductNameInput').css({
            'border': '1px solid #FF4545'
        });
        valid = false;

        $('#selectedProductNameInput').click(function(){

            $('#selectedProductNameInput').css({
                'border': 'unset',
                'border-bottom': '1px solid black'
            });
        })
    }

    if (decsVal == '' || decsVal == undefined || decsVal == 0) {
        $('#selectedProductDescriptionInput').css({
            'border': '1px solid #FF4545'
        });
        valid = false;

        $('#selectedProductDescriptionInput').click(function(){

            $('#selectedProductDescriptionInput').css({
                'border': 'unset',
                'border-bottom': '1px solid black'
            });
        })
    }

    if (priceVal == '' || priceVal == undefined || priceVal <= 0) {
        $('#selectedProductPriceInput').css({
            'border': '1px solid #FF4545'
        });
        valid = false;

        $('#selectedProductPriceInput').click(function(){

            $('#selectedProductPriceInput').css({
                'border': 'unset',
                'border-bottom': '1px solid black'
            });
        })
    }

    if (valid) {

        let products = items[0];

        for (let i = 0; i < products.length; i++) {
            
            if (products[i].id == $('#productDetails').attr('selectedProductId')) {
                products[i].name = nameVal;
                products[i].description = decsVal;
                products[i].price = Number(priceVal).toFixed(2);

                $.each($('.productWrapper'), function (key, value) {
                    if (products[i].id == $(value).attr('productId')) {

                        $(value).attr('productname', nameVal);
                        $(value).attr('productdesc', decsVal);
                        $(value).attr('productprice', Number(priceVal).toFixed(2));
                        $(value).find($('.productName')).html(nameVal);
                        $(value).find($('.productDescription')).html(decsVal);
                    }  
                });
            } else {

                let date = new Date();
                let newProdObj = {
                    id: items[0].slice(-1)[0].id + 1,
                    name: nameVal,
                    description: decsVal,
                    price: Number(priceVal).toFixed(2),
                    creationDate: date.getTime(),
                    thumbnailImage: '../images/addImg.jpg',
                    urlImage: '../images/addImg.jpg'
                }
                if (!items[0].includes(newProdObj)) {
                    items[0].push(newProdObj);
                    break;
                }       
            }  
        }

        $('#productDetails').hide();
        $('#productDetails').empty();
        $('#productList').removeClass('minimizeList');
        $('.productWrapper').removeClass('selectedDiv');

        $('#productDetails').attr('selectedProductId', '');

        $('#productNameToSave').html(nameVal);
        $('#saveProductPop').show();

        if ($('#selectFilter').val() == 'name') {

            items[0].sort(function(a,b){
                return a.name.localeCompare(b.name);
            })
            $('#productListContent, #prevNextWrapper').remove();
            counter = 0;
            buildItems(items[0]);
            
        } else if($('#selectFilter').val() == 'price') {
            $($('#selectFilter option')[0]).attr('disabled', true);
            items[0].sort(function(a, b) {
                return a.price - b.price;
            });
            $('#productListContent, #prevNextWrapper').remove();
            counter = 0;
            buildItems(items[0]);
        } else {
            $('#productListContent, #prevNextWrapper').remove();
            counter = 0;
            buildItems(items[0]);
        }
    }
}

function scrollBtn() {
    if ($(this).scrollTop() > 550) {
        $('.goToTopBtn').fadeIn();
    }
    else {
        $('.goToTopBtn').fadeOut();
    }
}

function closeCurrentPopup(that) {
    $($(that)[0].parentElement.parentElement.parentElement).hide();
}
