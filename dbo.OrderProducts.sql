CREATE TABLE [dbo].[OrderProducts] (
    [Id]         INT             IDENTITY (1, 1) NOT NULL,
    [OrderId]    INT             NOT NULL,
    [ProductId]  INT             NOT NULL,
    [Amount]     INT             NOT NULL,
    [TotalPrice] DECIMAL (18, 2) NOT NULL,
    CONSTRAINT [PK_OrderProducts] PRIMARY KEY CLUSTERED ([Id] ASC), 
    CONSTRAINT [FK_OrderProducts_Products] FOREIGN KEY ([ProductId]) REFERENCES [Products](Id),
    CONSTRAINT [FK_OrderProducts_Orders] FOREIGN KEY ([OrderId]) REFERENCES [Orders](Id)
);

