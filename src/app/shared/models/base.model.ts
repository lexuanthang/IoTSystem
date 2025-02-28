export class ResetPasswordVm{
    CurrentPassword: string;
    Password: string;
    ConfirmPassword: string;
}

export class DeleteModelRequest{
    Id: number;
    Guid: string;
    TenantId: number;
    TenantCode: string;
    StringId: string;
}

export class PagingRequest{
    PageIndex: number;
    PageSize: number;
    searchText: string;
    searchDate: string;
    searchDateString: string;
    Status: boolean;
}