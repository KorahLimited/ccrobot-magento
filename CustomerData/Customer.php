<?php

namespace Korah\CcRobot\CustomerData;

use Magento\Customer\CustomerData\SectionSourceInterface;
use Magento\Customer\Model\Session;

class Customer implements SectionSourceInterface
{
    protected $_customerSession;

    public function __construct(
        Session $customerSession
    ) {
        $this->_customerSession = $customerSession;
    }

    public function getSectionData()
    {
        $result = [
            "firstName" => "",
            "lastName" => "",
            "email" => "",
            "phone" => "",
            "isNewInstance" => true
        ];
        if($this->_customerSession->isLoggedIn())
        {
            $customer = $this->_customerSession->getCustomer();
            $result['firstName'] = $customer->getFirstname();
            $result['lastName'] = $customer->getLastname();
            $result['email'] = $customer->getEmail();
            $result['phone'] = $customer->getDefaultBillingAddress() ? $customer->getDefaultBillingAddress()->getTelephone() : "";
        }
        return $result;
    }
}

?>